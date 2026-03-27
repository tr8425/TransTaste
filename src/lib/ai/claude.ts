import Anthropic from '@anthropic-ai/sdk';
import { MenuAnalysisResult, AnalysisError } from '../types';
import { AIProvider, MenuInput } from './provider';

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
      "original": "string — exact text from the menu",
      "price": "string | null — as shown on menu, with currency symbol/unit",
      "language_detected": "string — ISO 639-1 code, e.g. 'ko', 'ja', 'th'",
      "translation": {
        "literal": "string — word-by-word translation",
        "meaning": "string — what the dish actually is",
        "english": "string — natural English name"
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
      "price_tier": "'budget' | 'mid' | 'premium' — relative to this restaurant/region",
      "fun_fact": "string — engaging cultural context (see TONE RULES below)",
      "how_to_eat": "string | null — practical eating tips if non-obvious",
      "image_search_query": "string — optimal English query to find a photo of this dish",

      "has_brand_name": "boolean — true if the dish name contains a restaurant/brand name",
      "brand_part": "string | undefined — the brand portion if has_brand_name is true",
      "brand_note": "string | undefined — explanation of the brand name if has_brand_name is true",
      "food_part": "string | undefined — the food portion if has_brand_name is true",

      "fun_fact_detail": {
        "label": "string — short label like 'History', 'Origin', 'Tradition'",
        "content": "string — the fun fact content"
      },

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

# FUN FACT TONE RULES (STRICT)
Your fun facts should make travelers excited about the food. Follow these rules:

NEVER use these words or framings:
- poverty, poor, waste, scraps, leftovers, garbage, offal (in negative context)
- disgusting, weird, strange, gross, acquired taste (as judgment)
- Sexual content: stamina, virility, aphrodisiac, sexual prowess

ALWAYS reframe with positive words:
- "born from scarcity" → "born from culinary creativity"
- "poor man's food" → "beloved comfort food" or "everyday icon"
- "waste parts" → "nose-to-tail tradition" or "zero-waste cooking philosophy"
- "stamina food" → "nutrient-rich" or "traditionally valued for its nutrition"

Every fun fact MUST end with why this food is enjoyable, delicious, or special TODAY.
Keep fun facts to 1-3 sentences. Be specific and surprising, not generic.

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

# HANDLING ERRORS
If the input is NOT a food menu, return:
{"error": "not_menu", "reason": "Description of what the image/text appears to be instead"}

If the image is too blurry or text is unreadable:
{"error": "ocr_failed", "reason": "The image is too blurry/dark/small to read reliably"}

If you can only read some items:
{"error": "partial", "reason": "Could only read N of approximately M items due to image quality"}
Include the items you could read in a partial response — return a valid MenuAnalysisResult with a note.

# IMPORTANT RULES
1. Analyze EVERY dish visible on the menu. Do not skip items.
2. Prices must be kept in the original currency format as shown on the menu.
3. Flavor profiles should be relative to the cuisine (e.g., Korean "not spicy" is still spicier than Western baseline).
4. For dietary flags, err on the side of caution. If uncertain about halal, set to null.
5. image_search_query should be specific enough to find an accurate photo of this exact dish.
6. If the menu is partially obscured, analyze what you can see and note limitations.
7. The output language for translations and descriptions should match the user's requested language (default: English).`;

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

  const contextText = contextParts.length > 0
    ? `\n\nUser context:\n${contextParts.join('\n')}\n\nAnalyze this menu:`
    : 'Analyze this menu:';

  if (input.inputType === 'image') {
    // Determine media type from base64 header or default to jpeg
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';
    let base64Data = input.input;

    if (input.input.startsWith('data:')) {
      const match = input.input.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        mediaType = match[1] as typeof mediaType;
        base64Data = match[2];
      }
    }

    return [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data,
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
    return { error: 'ocr_failed', reason: 'Invalid response structure from AI' };
  }

  // Check if it's an error response
  if (isAnalysisError(obj)) {
    return obj as AnalysisError;
  }

  const result = obj as Record<string, unknown>;

  // Validate minimum required fields
  if (!Array.isArray(result.dishes)) {
    return { error: 'ocr_failed', reason: 'Response missing dishes array' };
  }

  if (result.dishes.length === 0) {
    return { error: 'no_text', reason: 'No menu items could be identified' };
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
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    const client = new Anthropic({ apiKey });

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
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
        return { error: 'ocr_failed', reason: 'No text response from AI' };
      }

      const parsed = parseJsonResponse(textBlock.text);
      return validateResult(parsed);
    } catch (err: unknown) {
      if (err instanceof Anthropic.APIError) {
        if (err.status === 429) {
          return { error: 'network_error', reason: 'Rate limit exceeded. Please try again in a moment.' };
        }
        if (err.status === 401) {
          return { error: 'network_error', reason: 'API authentication failed.' };
        }
        return { error: 'network_error', reason: `API error: ${err.message}` };
      }
      if (err instanceof Error && err.message.includes('Failed to parse JSON')) {
        return { error: 'ocr_failed', reason: 'Could not parse AI response as valid menu data.' };
      }
      return { error: 'network_error', reason: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },

  estimateCost(inputTokens: number, outputTokens: number): number {
    // Claude Sonnet pricing (as of 2025): $3/M input, $15/M output
    return (inputTokens * 3 + outputTokens * 15) / 1_000_000;
  },
};
