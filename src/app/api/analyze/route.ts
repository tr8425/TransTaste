import { NextRequest, NextResponse } from "next/server";
import { selectProvider } from "@/lib/ai/provider";
import { MenuInput } from "@/lib/ai/provider";
import { createMenuAnalysisStream } from "@/lib/ai/claude";
import { isAnalysisError, InputType, MenuAnalysisResult } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rate-limit";

const VALID_INPUT_TYPES: InputType[] = ['image', 'url', 'text'];

const MOCK_RESULT: MenuAnalysisResult = {
  menu_meta: {
    language: "Japanese",
    restaurant_type: "Izakaya",
    country_detected: "Japan",
    items_found: 5,
  },
  menu_language: "Japanese",
  restaurant_type: "Izakaya",
  items_found: 5,
  dishes: [
    {
      original: "唐揚げ",
      price: "780",
      currency: "JPY",
      price_display: "¥780",
      language_detected: "ja",
      translation: { literal: "deep-fried chicken", meaning: "Japanese fried chicken", english: "Karaage" },
      confidence: "high",
      category: "main",
      dietary: { halal: null, vegan: false, vegetarian: false, gluten_free: false },
      allergens: ["gluten", "soy"],
      allergen_risk: "check",
      alternative_dishes: [],
      price_tier: "budget",
      image_search_query: "karaage japanese fried chicken",
    },
    {
      original: "海老フライ",
      price: "980",
      currency: "JPY",
      price_display: "¥980",
      language_detected: "ja",
      translation: { literal: "shrimp fry", meaning: "Deep-fried breaded shrimp", english: "Ebi Fry" },
      confidence: "high",
      category: "main",
      dietary: { halal: null, vegan: false, vegetarian: false, gluten_free: false },
      allergens: ["shellfish", "gluten", "egg"],
      allergen_risk: "danger",
      alternative_dishes: ["唐揚げ", "豚の角煮"],
      price_tier: "mid",
      image_search_query: "ebi fry japanese shrimp tempura",
    },
    {
      original: "麻婆豆腐",
      price: "850",
      currency: "JPY",
      price_display: "¥850",
      language_detected: "ja",
      translation: { literal: "numbing spicy tofu", meaning: "Spicy tofu with minced pork", english: "Mapo Tofu" },
      confidence: "high",
      category: "main",
      dietary: { halal: false, vegan: false, vegetarian: false, gluten_free: false },
      allergens: ["pork", "soy"],
      allergen_risk: "warning",
      alternative_dishes: ["揚げ出し豆腐"],
      price_tier: "budget",
      image_search_query: "mapo tofu japanese style",
    },
    {
      original: "揚げ出し豆腐",
      price: "580",
      currency: "JPY",
      price_display: "¥580",
      language_detected: "ja",
      translation: { literal: "deep-fried tofu in broth", meaning: "Lightly fried tofu in dashi broth", english: "Agedashi Tofu" },
      confidence: "high",
      category: "side",
      dietary: { halal: null, vegan: false, vegetarian: true, gluten_free: false },
      allergens: ["soy", "gluten"],
      allergen_risk: "check",
      alternative_dishes: [],
      price_tier: "budget",
      image_search_query: "agedashi tofu japanese",
    },
    {
      original: "豚の角煮",
      price: "1080",
      currency: "JPY",
      price_display: "¥1,080",
      language_detected: "ja",
      translation: { literal: "pork square simmered", meaning: "Braised pork belly in soy sauce", english: "Buta no Kakuni" },
      confidence: "high",
      category: "main",
      dietary: { halal: false, vegan: false, vegetarian: false, gluten_free: false },
      allergens: ["pork", "soy"],
      allergen_risk: "warning",
      alternative_dishes: ["唐揚げ", "揚げ出し豆腐"],
      price_tier: "mid",
      image_search_query: "buta no kakuni braised pork belly",
    },
  ],
  recommended_combo: {
    budget: { items: ["唐揚げ", "揚げ出し豆腐"], reason: "Classic izakaya pairing: crispy chicken + light tofu. Total ≈ ¥1,360" },
    balanced: { items: ["海老フライ", "麻婆豆腐", "揚げ出し豆腐"], reason: "Mix of seafood, spice, and mild — covers all flavors. Total ≈ ¥2,410" },
  },
} satisfies MenuAnalysisResult;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP — 20 requests per hour
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimit(`analyze:${ip}`, 20, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "rate_limited", reason: `Too many requests. Try again in ${Math.ceil(rl.reset / 60)} minutes.` },
        { status: 429, headers: { ...corsHeaders, "Retry-After": String(rl.reset) } }
      );
    }

    // Resolve API key: user-provided (x-api-key header) > server env
    const userApiKey = request.headers.get("x-api-key");
    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;

    // If no API key at all, return mock data for development
    if (!apiKey) {
      return NextResponse.json({ ...MOCK_RESULT, demo: true }, { headers: corsHeaders });
    }

    // Parse request body
    let body: {
      input?: string;
      inputType?: string;
      outputLanguage?: string;
      allergenPreset?: string[];
      dietaryBeliefs?: string[];
      dislikedIngredients?: string[];
      stream?: boolean;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "network_error", reason: "Invalid JSON in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate required fields
    if (!body.input || typeof body.input !== 'string') {
      return NextResponse.json(
        { error: "network_error", reason: "Missing or invalid 'input' field" },
        { status: 400, headers: corsHeaders }
      );
    }

    const inputType = (body.inputType || 'image') as InputType;
    if (!VALID_INPUT_TYPES.includes(inputType)) {
      return NextResponse.json(
        { error: "network_error", reason: `Invalid inputType: ${body.inputType}. Must be one of: ${VALID_INPUT_TYPES.join(', ')}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Build cache key
    const cacheInput = inputType === 'image'
      ? body.input.slice(0, 200)
      : body.input;
    const cacheKey = buildCacheKey({
      input: cacheInput,
      inputType,
      srcLang: 'auto',
      tgtLang: body.outputLanguage || 'en',
    });

    // Check cache before calling AI
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: corsHeaders });
    }

    // Build menu input
    const menuInput: MenuInput = {
      input: body.input,
      inputType,
      outputLanguage: body.outputLanguage,
      allergenPreset: body.allergenPreset,
      dietaryBeliefs: body.dietaryBeliefs,
      dislikedIngredients: body.dislikedIngredients,
      apiKey,
    };

    // Streaming mode: return SSE stream
    if (body.stream) {
      console.log('[TransTaste] Streaming mode requested, inputType:', inputType);
      const readable = createMenuAnalysisStream(menuInput, cacheKey);
      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
          ...corsHeaders,
        },
      });
    }

    // Non-streaming mode: select AI provider and analyze
    const provider = await selectProvider(inputType);
    const result = await provider.analyzeMenu(menuInput);

    // Return error responses with appropriate status codes
    if (isAnalysisError(result)) {
      const statusCode = result.error === 'network_error' ? 502 : 422;
      return NextResponse.json(result, { status: statusCode, headers: corsHeaders });
    }

    // Cache successful result
    const country = (result as MenuAnalysisResult).menu_meta?.country_detected;
    await setCache(cacheKey, result, country);

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      {
        error: "network_error",
        reason: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
