import { NextRequest, NextResponse } from "next/server";
import { selectProvider } from "@/lib/ai/provider";
import { MenuInput } from "@/lib/ai/provider";
import { createMenuAnalysisStream } from "@/lib/ai/claude";
import { isAnalysisError, InputType, MenuAnalysisResult } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  checkLanguage,
  checkMenuInput,
  checkStringList,
  clientIp,
  limiterRequired,
  rejectUntrustedRequest,
  securityLog,
} from "@/lib/api-guard";
import { isAdminRequest } from "@/lib/admin-session";

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
      estimated_calories: 350,
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
      estimated_calories: 400,
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
      estimated_calories: 300,
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
      estimated_calories: 150,
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
      estimated_calories: 550,
      price_tier: "mid",
      image_search_query: "buta no kakuni braised pork belly",
    },
  ],
  recommended_combo: {
    budget: { items: ["唐揚げ", "揚げ出し豆腐"], reason: "Classic izakaya pairing: crispy chicken + light tofu. Total ≈ ¥1,360" },
    balanced: { items: ["海老フライ", "麻婆豆腐", "揚げ出し豆腐"], reason: "Mix of seafood, spice, and mild — covers all flavors. Total ≈ ¥2,410" },
  },
} satisfies MenuAnalysisResult;

function badRequest(reason: string) {
  return NextResponse.json({ error: "E_BAD_REQUEST", reason }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const rejected = rejectUntrustedRequest(request, "analyze");
    if (rejected) return rejected;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return badRequest("Invalid JSON in request body");
    }
    if (!body || typeof body !== "object") return badRequest("Invalid JSON in request body");

    const inputType = (body.inputType || "image") as InputType;
    if (!VALID_INPUT_TYPES.includes(inputType)) {
      return badRequest(`Invalid inputType. Must be one of: ${VALID_INPUT_TYPES.join(", ")}`);
    }

    const input = checkMenuInput(body.input, inputType);
    if (!input.ok) return badRequest(input.reason);
    const outputLanguage = checkLanguage(body.outputLanguage);
    if (!outputLanguage.ok) return badRequest(outputLanguage.reason);
    const allergenPreset = checkStringList(body.allergenPreset, "allergenPreset");
    if (!allergenPreset.ok) return badRequest(allergenPreset.reason);
    const dietaryBeliefs = checkStringList(body.dietaryBeliefs, "dietaryBeliefs");
    if (!dietaryBeliefs.ok) return badRequest(dietaryBeliefs.reason);
    const dislikedIngredients = checkStringList(body.dislikedIngredients, "dislikedIngredients");
    if (!dislikedIngredients.ok) return badRequest(dislikedIngredients.reason);

    // Resolve API key only after the request contract has been validated.
    // Mock analysis is opt-in so a missing production secret cannot silently
    // turn real user scans into example results.
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const demoModeEnabled = process.env.ENABLE_DEMO_ANALYSIS === "true";

    if (!apiKey) {
      if (demoModeEnabled) {
        return NextResponse.json({ ...MOCK_RESULT, demo: true });
      }

      return NextResponse.json(
        {
          error: "E_SERVICE_UNAVAILABLE",
          reason: "Menu analysis is not configured.",
        },
        { status: 503 },
      );
    }

    // Rate limit by IP — 20 requests per hour. Only paid calls reach this point.
    // Admin sessions (owner access code) skip the limiter.
    const ip = clientIp(request);
    const rl = isAdminRequest(request)
      ? { allowed: true, remaining: Infinity, reset: 0, unavailable: false }
      : await checkRateLimit(`analyze:${ip}`, 20, 3600);
    if (rl.unavailable && limiterRequired()) {
      securityLog("rate_limiter_unavailable", { route: "analyze" });
      return NextResponse.json(
        { error: "E_SERVICE_UNAVAILABLE", reason: "Menu analysis is temporarily unavailable." },
        { status: 503 },
      );
    }
    if (!rl.allowed) {
      securityLog("rate_limited", { route: "analyze", ip });
      return NextResponse.json(
        { error: "E_RATE_LIMIT", reason: `Too many requests. Try again in ${Math.ceil(rl.reset / 60)} minutes.` },
        { status: 429, headers: { "Retry-After": String(rl.reset) } }
      );
    }

    const cacheKey = buildCacheKey({
      input: input.value,
      inputType,
      srcLang: "auto",
      tgtLang: outputLanguage.value || "en",
      allergenPreset: allergenPreset.value,
      dietaryBeliefs: dietaryBeliefs.value,
      dislikedIngredients: dislikedIngredients.value,
    });

    // Check cache before calling AI
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const menuInput: MenuInput = {
      input: input.value,
      inputType,
      outputLanguage: outputLanguage.value,
      allergenPreset: allergenPreset.value,
      dietaryBeliefs: dietaryBeliefs.value,
      dislikedIngredients: dislikedIngredients.value,
      apiKey,
    };

    // Streaming mode: return SSE stream
    if (body.stream) {
      const readable = createMenuAnalysisStream(menuInput, cacheKey);
      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // Non-streaming mode: select AI provider and analyze
    const provider = await selectProvider(inputType);
    const result = await provider.analyzeMenu(menuInput);

    // Return error responses with appropriate status codes
    if (isAnalysisError(result)) {
      const statusCode = result.error === 'network_error' ? 502 : 422;
      return NextResponse.json(result, { status: statusCode });
    }

    // Cache successful result
    const country = (result as MenuAnalysisResult).menu_meta?.country_detected;
    await setCache(cacheKey, result, country);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: "E_UNKNOWN", reason: "Internal server error" },
      { status: 500 }
    );
  }
}
