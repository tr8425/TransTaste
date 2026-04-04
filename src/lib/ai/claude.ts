import Anthropic from '@anthropic-ai/sdk';
import { MenuAnalysisResult, AnalysisError } from '../types';
import { AIProvider, MenuInput } from './provider';
import { IncrementalDishParser } from './stream-parser';
import { setCache } from '../cache';

const SYSTEM_PROMPT = `You are TransTaste, an expert food menu analyzer for international travelers. You receive a photo or text of a restaurant menu in any language and produce a detailed JSON analysis.

# OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no code blocks, no commentary). The JSON must match this schema exactly:

{
  "menu_meta": {
    "language": "string — ISO language name, e.g. 'Korean', 'Japanese', 'Thai'",
    "restaurant_type": "string — e.g. 'Korean BBQ', 'Japanese Izakaya', 'Thai Street Food'",
    "country_detected": "string — e.g. 'South Korea', 'Japan'",
    "items_found": "number"
  },
  "dishes": [
    {
      "original": "string — dish name only, WITHOUT price numbers (e.g. '불고기' not '불고기 18000')",
      "price": "string | null — numeric value as string",
      "currency": "string | null — ISO 4217 code: KRW, JPY, USD, THB, EUR, etc.",
      "price_display": "string | null — formatted: ₩17,000, ¥1,200, $14.00, ฿450",
      "language_detected": "string — ISO 639-1 code, e.g. 'ko', 'ja', 'th'",
      "translation": {
        "literal": "string — word-by-word translation",
        "meaning": "string — what the dish actually is",
        "english": "string — natural English name",
        "pronunciation": "string — romanized pronunciation guide for ordering (e.g. 'bul-go-gi', 'tom-yam-kung', 'gyū-don')"
      },
      "confidence": "'high' | 'medium' | 'low'",
      "category": "string — 'main' | 'side' | 'soup' | 'noodle' | 'rice' | 'appetizer' | 'dessert' | 'drink' | 'set'",
      "flavor_profile": {
        "sweet": "0-5",
        "salty": "0-5",
        "spicy": "0-5",
        "sour": "0-5",
        "umami": "0-5",
        "rich": "0-5"
      },
      "ingredients": {
        "core": ["string — main ingredients"],
        "common_additions": ["string — typical sides/garnishes"],
        "allergens": ["string — from: shellfish, pork, gluten, dairy, nuts, egg, soy, fish, sesame, celery, mustard, sulfites"]
      },
      "dietary": {
        "halal": "boolean | null (null if uncertain)",
        "vegan": "boolean",
        "vegetarian": "boolean",
        "gluten_free": "boolean"
      },
      "estimated_calories": "number | null — rough kcal estimate for a typical single serving. null if truly unknown (e.g. drinks with variable size). Round to nearest 50.",
      "price_tier": "'budget' | 'mid' | 'premium' — relative to this restaurant/region",
      "fun_fact": "string | null — engaging cultural context (see FUN FACT RULES below). null if no genuinely interesting fact exists.",
      "how_to_eat": "string | null — practical eating tips if non-obvious",
      "image_search_query": "string — optimal English query to find a photo of this dish",

      "has_brand_name": "boolean — true if the dish name contains a restaurant/brand name",
      "brand_part": "string | undefined — the brand portion if has_brand_name is true",
      "brand_note": "string | undefined — explanation of the brand name if has_brand_name is true",
      "food_part": "string | undefined — the food portion if has_brand_name is true",

      "fun_fact_detail": "{ label: string, content: string } | null — only when fun_fact is non-null",

      "warning": {
        "level": "'taste' | 'intensity' | 'texture' | 'alcohol' | null",
        "message": "string — neutral description of what to expect"
      },

      "disclosure": {
        "target_culture": "string — which cultural background this disclosure is for",
        "message": "string — bridging explanation"
      },

      "has_customization": "boolean — true if the menu shows options/add-ons",
      "options": [
        {
          "label": "string — e.g. 'Size', 'Spice Level'",
          "type": "'single' | 'multi' | 'addon'",
          "required": "boolean",
          "choices": [
            {
              "name": "string — original language",
              "name_translated": "string — English",
              "price_delta": "number | undefined",
              "allergens": ["string"]
            }
          ]
        }
      ],

      "allergen_summary": {
        "preset_triggered": ["string — which user allergen presets match"],
        "overall_risk": "'danger' | 'warning' | 'check' | 'safe'",
        "risk_details": [
          {
            "ingredient": "string",
            "risk_level": "'main' | 'sub' | 'possible'"
          }
        ],
        "alternative_dishes": ["string — suggestions from the same menu"]
      }
    }
  ],
  "recommended_combo": {
    "budget": {
      "items": ["string — original dish names from the menu"],
      "reason": "string — why this combo works, including approximate total price"
    },
    "balanced": {
      "items": ["string — original dish names from the menu"],
      "reason": "string — why this combo works for a well-rounded meal"
    }
  }
}

# BRAND NAME HANDLING
Many Asian restaurant menus prefix dish names with a brand or restaurant name:
- Family name patterns: "박가" (Park's), "최가네" (Choi Family's), "이가" (Lee's), "김가" (Kim's)
- "원조" = "Original" (claims to be the original/first)
- Pure brand names like "봉추", "신전", "엽기" → keep as transliteration, do not translate literally
- Set has_brand_name=true and split into brand_part and food_part
- In translation.english, translate only the food_part; mention the brand in brand_note

# FUN FACT RULES (STRICT)

## When to generate a fun fact (ALL conditions must be met):
- The dish name has an interesting origin, backstory, or unexpected etymology
- OR there is a specific cultural tradition, historical event, or regional practice that travelers would genuinely find surprising
- OR there is a well-known but little-understood aspect that bridges cultural gaps
- The fact is SPECIFIC to THIS dish, not a generic statement about the cuisine or ingredient category

## When to return fun_fact: null (return null if ANY of these apply):
- The dish is a common/universal item (plain rice, cola, water, bread, basic salad)
- The only "fact" you can think of is a generic statement about the cuisine or main ingredient
- The fact would be obvious to anyone who has eaten at this type of restaurant before
- You are stretching to find something interesting — if it feels forced, it IS forced

## Tone rules (when fun_fact IS generated):
NEVER use: poverty, poor, waste, scraps, leftovers, garbage, disgusting, weird, strange, gross, acquired taste, stamina, virility, aphrodisiac, sexual, erotic, seductive
ALWAYS reframe positively:
- "born from scarcity" → "born from culinary creativity"
- "poor man's food" → "beloved comfort food"
- "waste parts" → "nose-to-tail tradition"
- "stamina food" → "nutrient-rich" or "traditionally valued for its nutrition"
- War/famine origins → "resourcefulness" or "culinary ingenuity born from history"

Every fun fact MUST end with why this food is special TODAY.
Keep fun facts to 1-2 sentences. Be specific and surprising, not generic.

## fun_fact_detail (collapsible extra info):
For dishes with polarizing or strongly divisive reputations (e.g., live octopus, century egg, haggis, casu marzu), put the main fun_fact as a brief positive hook, and move detailed/challenging context into fun_fact_detail { label: "Deep Dive", content: "..." }. This way the user sees the friendly fact first and can optionally expand for more.

# WARNING SYSTEM (separate from fun_fact)
Add a warning object when a dish may surprise or challenge certain diners:

- level: 'taste' → for polarizing flavors (hongeo/fermented skate, natto, durian, stinky tofu, surstroemming, blue cheese)
  Message: describe the flavor profile neutrally. Mention "intensity varies by restaurant."

- level: 'intensity' → for extremely spicy, sour, or pungent dishes
  Message: describe what to expect. Suggest milder alternatives if available on menu.

- level: 'texture' → for unusual textures (tripe, jellyfish, chicken feet, sea cucumber)
  Message: describe the texture neutrally. Compare to something familiar.

- level: 'alcohol' → for dishes with significant alcohol content
  Message: note approximate ABV or alcohol type.

- null → for dishes with no special warnings needed

Tone: Always neutral and informative, never judgmental. Frame as "here's what to expect" not "this is weird."

# ALLERGEN RISK LEVELS
For each dish, assess allergen risk at 4 levels:

- 'main': The allergen IS the core dish (e.g., shrimp in shrimp tempura, peanuts in peanut sauce).
  Cannot be removed. overall_risk = 'danger'

- 'sub': The allergen is a notable ingredient but could potentially be removed or substituted
  (e.g., egg topping on bibimbap, shrimp on pad thai). overall_risk = 'warning'

- 'possible': The allergen may be present in sauces, broths, or via cross-contamination
  (e.g., fish sauce in Thai curries, soy in Korean stews, shared fryers). overall_risk = 'check'

- If no allergens from the user's preset are found: overall_risk = 'safe'

When overall_risk is 'danger' or 'warning', suggest alternative_dishes from the same menu if possible.

# DISCLOSURE SYSTEM
Add a disclosure ONLY when there is a significant cultural gap between the user's likely background and the food's culture:

Examples:
- Western user eating Korean gopchang (intestines): compare to French andouillette or chitlins
- Korean user eating Japanese horumon: compare to gopchang
- Western user eating hongeo (fermented skate): compare to strong blue cheese or Icelandic hakarl
- Any user eating insects: note that this is a mainstream protein source in the food's culture

Only add disclosure when it genuinely helps bridge understanding. Do NOT add disclosures for common cross-cultural foods (sushi, kimchi, pad thai, etc.)

# CUSTOMIZATION OPTIONS
If the menu shows customization options (size, spice level, toppings, add-ons):
- Set has_customization = true
- List each option group with its choices
- Translate choice names
- Note any price differences
- Flag allergens in specific choices

# MENU FORMAT RECOGNITION
Handle diverse menu formats beyond standard printed menus:

- **Kiosk screens**: Ignore UI elements (buttons, navigation bars, app chrome). Focus only on food item names, prices, and descriptions. If the image clearly shows a kiosk ordering interface, note restaurant_type accordingly.
- **Handwritten menus**: Apply extra OCR tolerance. If characters are ambiguous, use context (cuisine type, surrounding items) to infer the most likely reading. Flag confidence as 'medium' or 'low' for unclear items.
- **Chalkboard/whiteboard menus**: Same as handwritten — infer from context, flag low confidence items.
- **QR-linked web menus**: If the input is a URL, treat the page content as the menu source.
- **Hotel room service / airline menus**: Note the format in restaurant_type (e.g. "Hotel Room Service", "Airline Menu").
- **Market price items (싯가/時価/시가)**: When a dish shows "market price" instead of a fixed price, set price to null, price_display to "Market Price", and add a note in how_to_eat suggesting the user ask staff for today's price.

# HANDLING ERRORS
If the input is NOT a food menu, return:
{"error": "not_menu", "reason": "Description of what the image/text appears to be instead"}

If the image is too blurry or text is unreadable:
{"error": "ocr_failed", "reason": "The image is too blurry/dark/small to read reliably"}

If you can only read some items:
{"error": "partial", "reason": "Could only read N of approximately M items due to image quality"}
Include the items you could read in a partial response — return a valid MenuAnalysisResult with a note.

# PRICE FORMATTING
- price: numeric string as shown on menu (e.g. "17000", "1200", "14.00")
- currency: ISO 4217 code derived from country_detected (KRW, JPY, USD, THB, EUR, etc.)
- price_display: local currency symbol + local formatting: ₩17,000, ¥1,200, $14.00, ฿450
- Do NOT convert currencies. If menu shows "17.0" for Korean restaurant, interpret as ₩17,000.

# IMPORTANT RULES
1. Analyze EVERY dish visible on the menu. Do not skip items.
2. The "original" field must contain ONLY the dish name — strip all price numbers, currency symbols, and quantity info. Prices go in the "price" field.
3. Flavor profiles should be relative to the cuisine (e.g., Korean "not spicy" is still spicier than Western baseline).
4. For dietary flags, err on the side of caution. If uncertain about halal, set to null.
5. image_search_query should be specific enough to find an accurate photo of this exact dish.
6. If the menu is partially obscured, analyze what you can see and note limitations.
7. The output language for translations and descriptions should match the user's requested language (default: English).`;

// Phase 1: Lite schema — only fields needed for the dish list view
const SYSTEM_PROMPT_LITE = `You are TransTaste, an expert food menu analyzer. Analyze the menu and return a LITE JSON with only essential fields for a quick overview.

# OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no code blocks, no commentary):

{
  "menu_meta": {
    "language": "string — ISO language name",
    "restaurant_type": "string — e.g. 'Korean BBQ'",
    "country_detected": "string — e.g. 'South Korea'",
    "items_found": "number"
  },
  "dishes": [
    {
      "original": "string — dish name only, WITHOUT price numbers (e.g. '불고기' not '불고기 18000')",
      "price": "string | null — numeric value as string",
      "currency": "string | null — ISO 4217 code: KRW, JPY, USD, THB, EUR, etc.",
      "price_display": "string | null — formatted with currency symbol: ₩17,000, ¥1,200, $14.00, ฿450",
      "language_detected": "string — ISO 639-1 code",
      "translation": {
        "literal": "string — word-by-word translation",
        "meaning": "string — what the dish actually is",
        "english": "string — natural English name",
        "pronunciation": "string — romanized pronunciation guide for ordering (e.g. 'bul-go-gi', 'tom-yam-kung', 'gyū-don')"
      },
      "confidence": "'high' | 'medium' | 'low'",
      "category": "'main' | 'side' | 'soup' | 'noodle' | 'rice' | 'appetizer' | 'dessert' | 'drink' | 'set' | 'salad'",
      "dietary": {
        "halal": "boolean | null",
        "vegan": "boolean",
        "vegetarian": "boolean",
        "gluten_free": "boolean"
      },
      "allergens": ["string — from: shellfish, pork, gluten, dairy, nuts, egg, soy, fish, sesame, celery, mustard, sulfites"],
      "allergen_risk": "'danger' | 'warning' | 'check' | 'safe'",
      "alternative_dishes": ["string — safer alternatives from the same menu when allergen_risk is danger/warning, empty otherwise"],
      "estimated_calories": "number | null — rough kcal estimate for a typical single serving. null if truly unknown. Round to nearest 50.",
      "price_tier": "'budget' | 'mid' | 'premium'",
      "image_search_query": "string — English query to find a photo of this dish"
    }
  ],
  "recommended_combo": {
    "budget": {
      "items": ["string — original dish names"],
      "reason": "string — why this combo works"
    },
    "balanced": {
      "items": ["string — original dish names"],
      "reason": "string — why this combo works"
    }
  }
}

# ALLERGEN RISK
- 'danger': allergen IS the core dish (cannot remove)
- 'warning': allergen is notable but potentially removable
- 'check': allergen may be in sauces/broths/cross-contamination
- 'safe': no common allergens detected

# BRAND NAMES
If a dish name has a brand/restaurant prefix (박가, 최가네, 원조, etc.), translate only the food portion in translation.english.

# ERROR HANDLING
Not a food menu: {"error": "not_menu", "reason": "..."}
Unreadable: {"error": "ocr_failed", "reason": "..."}

# PRICE FORMATTING
- price: numeric string as shown on menu (e.g. "17000", "1200", "14.00")
- currency: ISO 4217 code derived from country_detected
- price_display: local currency symbol + local formatting convention:
  Korea: ₩17,000 (won, thousands with comma)
  Japan: ¥1,200 (yen, no decimal)
  USA: $14.00 (dollar, 2 decimals)
  Thailand: ฿450 (baht)
  Europe: €12.50 (euro)
- Do NOT convert currencies. Show exactly what the menu shows.
- If menu shows "17.0" for a Korean restaurant, interpret as ₩17,000 (만원 단위 표기)

# RULES
1. Analyze EVERY dish visible. Do not skip items.
2. The "original" field must contain ONLY the dish name — strip all price numbers, currency symbols, and quantity info. Prices go in the "price" field.
3. If uncertain about halal, set to null.
4. Output language matches user's requested language (default: English).
5. Keep this response CONCISE — only the fields above, nothing extra.`;

// Phase 2: Detail prompt — single dish deep analysis
const SYSTEM_PROMPT_DETAIL = `You are TransTaste. Given a menu and a specific dish name, return a detailed analysis of ONLY that one dish.

# OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no code blocks):

{
  "flavor_profile": { "sweet": "0-5", "salty": "0-5", "spicy": "0-5", "sour": "0-5", "umami": "0-5", "rich": "0-5" },
  "ingredients": {
    "core": ["string — main ingredients"],
    "common_additions": ["string — typical sides/garnishes"],
    "allergens": ["string — from: shellfish, pork, gluten, dairy, nuts, egg, soy, fish, sesame, celery, mustard, sulfites"]
  },
  "fun_fact": "string | null — see rules below",
  "fun_fact_detail": "{ label: string, content: string } | null",
  "how_to_eat": "string | null — practical tips if non-obvious",
  "warning": { "level": "'taste' | 'intensity' | 'texture' | 'alcohol' | null", "message": "string" } | null,
  "disclosure": { "target_culture": "string", "message": "string" } | null,
  "has_brand_name": "boolean",
  "brand_part": "string | undefined",
  "brand_note": "string | undefined",
  "food_part": "string | undefined",
  "has_customization": "boolean",
  "options": [{ "label": "string", "type": "'single'|'multi'|'addon'", "required": "boolean", "choices": [{ "name": "string", "name_translated": "string", "price_delta": "number|undefined", "allergens": ["string"] }] }],
  "allergen_summary": {
    "preset_triggered": ["string"],
    "overall_risk": "'danger'|'warning'|'check'|'safe'",
    "risk_details": [{ "ingredient": "string", "risk_level": "'main'|'sub'|'possible'" }],
    "alternative_dishes": ["string"]
  }
}

# FUN FACT RULES
Generate fun_fact ONLY when:
- The dish has an interesting origin, backstory, or unexpected etymology
- OR a specific cultural tradition travelers would find surprising
- The fact is SPECIFIC to THIS dish, not generic
Return null for common items (rice, cola, bread, basic salads) or when stretching.
Tone: positive, 1-2 sentences, end with why it's special today.
NEVER use: poverty, poor, waste, scraps, disgusting, weird, stamina, virility.

# WARNING SYSTEM
- 'taste': polarizing flavors (fermented, funky). Describe neutrally.
- 'intensity': extremely spicy/sour/pungent. Suggest alternatives.
- 'texture': unusual textures (tripe, jellyfish). Compare to familiar.
- 'alcohol': note ABV. null if no warning needed.

# DISCLOSURE
Only when significant cultural gap exists. Skip for common cross-cultural foods.

# CUSTOMIZATION
If menu shows options (size, spice level, toppings): set has_customization=true and list them.

# RULES
- Flavor profiles relative to the cuisine.
- If uncertain about halal, set null.
- Output language matches user's requested language.`;

function buildUserMessage(input: MenuInput): Anthropic.MessageCreateParams['messages'] {
  const contextParts: string[] = [];

  if (input.outputLanguage && input.outputLanguage !== 'en') {
    contextParts.push(`Output language: ${input.outputLanguage} (write all descriptions, fun facts, translations in this language, but keep JSON keys in English)`);
  }

  if (input.allergenPreset && input.allergenPreset.length > 0) {
    contextParts.push(`User allergen presets: ${input.allergenPreset.join(', ')}. Flag any dishes containing these allergens in allergen_summary.`);
  }

  if (input.dietaryBeliefs && input.dietaryBeliefs.length > 0) {
    contextParts.push(`User dietary preferences: ${input.dietaryBeliefs.join(', ')}. Highlight compatible and incompatible dishes.`);
  }

  if (input.dislikedIngredients && input.dislikedIngredients.length > 0) {
    contextParts.push(`User dislikes these ingredients (not allergies, personal preference): ${input.dislikedIngredients.join(', ')}. If a dish likely contains any of these, add a "disliked_ingredients" array field with the matching items in the dish JSON.`);
  }

  const contextText = contextParts.length > 0
    ? `\n\nUser context:\n${contextParts.join('\n')}\n\nAnalyze this menu:`
    : 'Analyze this menu:';

  if (input.inputType === 'image') {
    // Support multiple images joined with "|||" delimiter from frontend
    const imageStrings = input.input.split('|||');

    const imageBlocks: Anthropic.ImageBlockParam[] = imageStrings.map((imgStr) => {
      let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';
      let base64Data = imgStr.trim();

      if (base64Data.startsWith('data:')) {
        const commaIdx = base64Data.indexOf(',');
        if (commaIdx !== -1) {
          const prefix = base64Data.slice(0, commaIdx);
          const typeMatch = prefix.match(/image\/(\w+)/);
          if (typeMatch) {
            mediaType = `image/${typeMatch[1]}` as typeof mediaType;
          }
          base64Data = base64Data.slice(commaIdx + 1);
        }
      }

      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: mediaType,
          data: base64Data,
        },
      };
    });

    return [
      {
        role: 'user',
        content: [
          ...imageBlocks,
          {
            type: 'text',
            text: imageStrings.length > 1
              ? `${contextText}\nThese are ${imageStrings.length} photos of the same menu. Analyze ALL menu items across all images as a single combined menu.`
              : contextText,
          },
        ],
      },
    ];
  }

  // Text or URL input
  if (input.inputType === 'url') {
    return [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'url',
              url: input.input,
            },
          },
          {
            type: 'text',
            text: contextText,
          },
        ],
      },
    ];
  }

  // Plain text menu
  return [
    {
      role: 'user',
      content: `${contextText}\n\n${input.input}`,
    },
  ];
}

function parseJsonResponse(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // ignore
  }

  // Try extracting from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // ignore
    }
  }

  // Try finding JSON object boundaries
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      // ignore
    }
  }

  throw new Error('Failed to parse JSON from Claude response');
}

function isAnalysisError(obj: unknown): obj is AnalysisError {
  return typeof obj === 'object' && obj !== null && 'error' in obj && 'reason' in obj;
}

function validateResult(obj: unknown): MenuAnalysisResult | AnalysisError {
  if (typeof obj !== 'object' || obj === null) {
    return { error: 'E_PARSE_FAIL', reason: 'Invalid response structure from AI' };
  }

  // Check if it's an error response
  if (isAnalysisError(obj)) {
    return obj as AnalysisError;
  }

  const result = obj as Record<string, unknown>;

  // Validate minimum required fields
  if (!Array.isArray(result.dishes)) {
    return { error: 'E_PARSE_FAIL', reason: 'Response missing dishes array' };
  }

  if (result.dishes.length === 0) {
    return { error: 'E_NO_TEXT', reason: 'No menu items could be identified' };
  }

  // Normalize: ensure menu_meta exists
  const menuMeta = result.menu_meta as Record<string, unknown> | undefined;
  const normalized: MenuAnalysisResult = {
    menu_meta: menuMeta
      ? {
          language: String(menuMeta.language || 'Unknown'),
          restaurant_type: String(menuMeta.restaurant_type || 'Unknown'),
          country_detected: String(menuMeta.country_detected || 'Unknown'),
          items_found: Number(menuMeta.items_found || result.dishes.length),
        }
      : {
          language: String(result.menu_language || 'Unknown'),
          restaurant_type: String(result.restaurant_type || 'Unknown'),
          country_detected: 'Unknown',
          items_found: (result.dishes as unknown[]).length,
        },
    // Keep backwards-compatible flat fields
    menu_language: String(menuMeta?.language || result.menu_language || 'Unknown'),
    restaurant_type: String(menuMeta?.restaurant_type || result.restaurant_type || 'Unknown'),
    items_found: Number(menuMeta?.items_found || result.items_found || (result.dishes as unknown[]).length),
    dishes: result.dishes as MenuAnalysisResult['dishes'],
    recommended_combo: (result.recommended_combo as MenuAnalysisResult['recommended_combo']) || {
      budget: { items: [], reason: 'No recommendation available' },
      balanced: { items: [], reason: 'No recommendation available' },
    },
  };

  return normalized;
}

export const claudeSonnetProvider: AIProvider = {
  name: 'claude-sonnet',

  async analyzeMenu(input: MenuInput): Promise<MenuAnalysisResult | AnalysisError> {
    const apiKey = input.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    const client = new Anthropic({ apiKey });

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16384,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: buildUserMessage(input),
      });

      // Extract text from response
      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        return { error: 'E_AI_ERROR', reason: 'No text response from AI' };
      }

      console.log('[TransTaste] Claude response stop_reason:', response.stop_reason);
      console.log('[TransTaste] Claude response text (first 500 chars):', textBlock.text.slice(0, 500));

      if (response.stop_reason === 'max_tokens') {
        console.warn('[TransTaste] Response was truncated by max_tokens limit!');
        return { error: 'E_MAX_TOKENS', reason: 'AI response was truncated. Try a smaller menu photo.', _debug: `tokens=${response.usage?.output_tokens}` };
      }

      const parsed = parseJsonResponse(textBlock.text);
      return validateResult(parsed);
    } catch (err: unknown) {
      if (err instanceof Anthropic.APIError) {
        if (err.status === 429) {
          return { error: 'E_AI_RATE_LIMIT', reason: 'Rate limit exceeded. Please try again in a moment.', _debug: `status=429` };
        }
        if (err.status === 401) {
          return { error: 'E_AUTH', reason: 'API authentication failed. Check your API key.', _debug: `status=401` };
        }
        return { error: 'E_AI_ERROR', reason: `API error: ${err.message}`, _debug: `status=${err.status}` };
      }
      if (err instanceof Error && err.message.includes('Failed to parse JSON')) {
        return { error: 'E_PARSE_FAIL', reason: 'Could not parse AI response as valid menu data.' };
      }
      return { error: 'E_UNKNOWN', reason: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },

  estimateCost(inputTokens: number, outputTokens: number): number {
    // Claude Sonnet pricing (as of 2025): $3/M input, $15/M output
    return (inputTokens * 3 + outputTokens * 15) / 1_000_000;
  },
};

/**
 * Creates a ReadableStream that emits SSE events as Claude analyzes a menu.
 * Events: meta (menu_meta), dish (individual dish), done (full result), error
 */
export function createMenuAnalysisStream(
  input: MenuInput,
  cacheKey?: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const parser = new IncrementalDishParser();

  return new ReadableStream({
    async start(controller) {
      let closed = false;

      const emit = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch (e) {
          console.error('[TransTaste] SSE emit error:', e);
        }
      };

      const close = () => {
        if (closed) return;
        closed = true;
        try { controller.close(); } catch { /* already closed */ }
      };

      try {
        const apiKey = input.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

        console.log('[TransTaste] Starting streaming analysis (lite schema)...');
        const client = new Anthropic({ apiKey });
        const stream = client.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT_LITE,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: buildUserMessage(input),
        });

        stream.on('text', (text) => {
          try {
            const { newMeta, newDishes } = parser.addChunk(text);
            if (newMeta) emit('meta', newMeta);
            for (const dish of newDishes) emit('dish', dish);
          } catch (e) {
            console.error('[TransTaste] Parser error on chunk:', e);
          }
        });

        console.log('[TransTaste] Waiting for stream to complete...');
        const finalMessage = await stream.finalMessage();
        console.log('[TransTaste] Stream complete. stop_reason:', finalMessage.stop_reason);

        if (finalMessage.stop_reason === 'max_tokens') {
          console.warn('[TransTaste] Streaming response truncated by max_tokens');
          emit('error', { error: 'E_MAX_TOKENS', reason: 'AI response was truncated. Try a smaller menu photo.', _debug: `tokens=${finalMessage.usage?.output_tokens}` });
          close();
          return;
        }

        // Validate full response
        const textBlock = finalMessage.content.find((b) => b.type === 'text');
        if (!textBlock || textBlock.type !== 'text') {
          emit('error', { error: 'E_AI_ERROR', reason: 'No text response from AI' });
        } else {
          const parsed = parseJsonResponse(textBlock.text);
          const result = validateResult(parsed);

          // Cache successful results
          if (!isAnalysisError(result) && cacheKey) {
            const country = (result as MenuAnalysisResult).menu_meta?.country_detected;
            setCache(cacheKey, result, country).catch(() => {});
          }

          emit('done', result);
        }
      } catch (err) {
        console.error('[TransTaste] Stream error:', err);
        if (err instanceof Anthropic.APIError) {
          if (err.status === 429) {
            emit('error', { error: 'E_AI_RATE_LIMIT', reason: 'Rate limit exceeded. Please try again.', _debug: `status=429` });
          } else if (err.status === 401) {
            emit('error', { error: 'E_AUTH', reason: 'API authentication failed.', _debug: `status=401` });
          } else {
            emit('error', { error: 'E_AI_ERROR', reason: `API error: ${err.message}`, _debug: `status=${err.status}` });
          }
        } else {
          emit('error', {
            error: 'E_UNKNOWN',
            reason: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      close();
    },
  });
}

/**
 * Phase 2: Fetch detailed analysis for a single dish.
 * Non-streaming, returns DishDetail or null on error.
 */
export async function fetchDishDetail(
  input: MenuInput,
  dishOriginal: string,
  dishCategory: string,
): Promise<{ data: import('../types').DishDetail } | { error: string }> {
  const apiKey = input.apiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { error: 'ANTHROPIC_API_KEY not set' };

  const client = new Anthropic({ apiKey });

  // Build user message with the menu context + dish identifier
  const baseMessages = buildUserMessage(input);
  const detailInstruction = `Analyze ONLY the dish named "${dishOriginal}" (category: ${dishCategory}) from this menu. Return the detailed JSON for this single dish following the schema exactly.`;

  // Append the detail instruction to the existing user message
  const messages = baseMessages.map((msg) => {
    if (msg.role === 'user') {
      if (typeof msg.content === 'string') {
        return { ...msg, content: `${msg.content}\n\n${detailInstruction}` };
      }
      return {
        ...msg,
        content: [
          ...msg.content,
          { type: 'text' as const, text: detailInstruction },
        ],
      };
    }
    return msg;
  });

  try {
    console.log(`[TransTaste] Fetching detail for: "${dishOriginal}"`);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT_DETAIL,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    });

    console.log('[TransTaste] Detail stop_reason:', response.stop_reason);

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { error: 'No text response from AI' };
    }

    console.log('[TransTaste] Detail response (first 500):', textBlock.text.slice(0, 500));
    console.log('[TransTaste] Detail response (last 200):', textBlock.text.slice(-200));
    console.log('[TransTaste] Detail response length:', textBlock.text.length);

    // Sanitize: Claude sometimes outputs JavaScript `undefined` instead of JSON `null`
    const sanitized = textBlock.text.replace(/:\s*undefined\b/g, ': null');

    let parsed: unknown;
    try {
      parsed = parseJsonResponse(sanitized);
    } catch (e) {
      console.error('[TransTaste] Detail JSON parse error:', (e as Error).message);
      return { error: `JSON parse failed: ${(e as Error).message}` };
    }

    if (typeof parsed !== 'object' || parsed === null) {
      return { error: 'Invalid JSON structure in response' };
    }

    return { data: parsed as import('../types').DishDetail };
  } catch (err) {
    const msg = err instanceof Anthropic.APIError
      ? `API error ${err.status}: ${err.message}`
      : err instanceof Error ? err.message : 'Unknown error';
    console.error('[TransTaste] fetchDishDetail error:', msg);
    return { error: msg };
  }
}
