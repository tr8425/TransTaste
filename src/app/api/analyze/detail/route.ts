import { NextRequest, NextResponse } from "next/server";
import { fetchDishDetail } from "@/lib/ai/claude";
import { MenuInput } from "@/lib/ai/provider";
import { InputType, DishDetail } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { createHash } from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

const DEMO_DETAIL: DishDetail = {
  flavor_profile: {
    sweet: 2,
    salty: 4,
    spicy: 1,
    sour: 1,
    umami: 5,
    rich: 3,
  },
  ingredients: {
    core: [],
    common_additions: [],
    allergens: [],
  },
  fun_fact: null,
  how_to_eat: null,
  warning: null,
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isFreeEventActive(): boolean {
  const until = process.env.FREE_EVENT_UNTIL;
  if (!until) return false;
  const deadline = new Date(until + "T23:59:59");
  return !isNaN(deadline.getTime()) && new Date() <= deadline;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function buildDishCacheKey(phase1Key: string, dishOriginal: string): string {
  return createHash("sha256")
    .update(`detail:${phase1Key}:${dishOriginal}`)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP — 30 detail requests per hour
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimit(`detail:${ip}`, 30, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "E_RATE_LIMIT", reason: `Too many requests. Try again in ${Math.ceil(rl.reset / 60)} minutes.` },
        { status: 429, headers: { ...corsHeaders, "Retry-After": String(rl.reset) } }
      );
    }

    // API credentials are server-managed and never accepted from the browser.
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const demoModeEnabled = process.env.ENABLE_DEMO_ANALYSIS === "true";

    // Mock mode — no key at all
    if (!apiKey && !demoModeEnabled) {
      return NextResponse.json(
        {
          error: "E_SERVICE_UNAVAILABLE",
          reason: "Dish detail analysis is not configured.",
        },
        { status: 503, headers: corsHeaders }
      );
    }

    let body: {
      input?: string;
      inputType?: string;
      dishOriginal?: string;
      dishCategory?: string;
      outputLanguage?: string;
      allergenPreset?: string[];
      dietaryBeliefs?: string[];
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "E_BAD_REQUEST", reason: "Invalid JSON" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!body.input || !body.dishOriginal) {
      return NextResponse.json(
        { error: "E_BAD_REQUEST", reason: "Missing input or dishOriginal" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { ...DEMO_DETAIL, demo: true },
        { headers: corsHeaders },
      );
    }

    const inputType = (body.inputType || "image") as InputType;

    // Build cache keys
    const phase1Key = buildCacheKey({
      input: body.input,
      inputType,
      srcLang: "auto",
      tgtLang: body.outputLanguage || "en",
    });
    const dishKey = buildDishCacheKey(phase1Key, body.dishOriginal);

    // Check cache
    const cached = await getCached(dishKey);
    if (cached) {
      return NextResponse.json(cached, { headers: corsHeaders });
    }

    // Fetch from Claude
    const menuInput: MenuInput = {
      input: body.input,
      inputType,
      outputLanguage: body.outputLanguage,
      allergenPreset: body.allergenPreset,
      dietaryBeliefs: body.dietaryBeliefs,
      apiKey,
    };

    const result = await fetchDishDetail(
      menuInput,
      body.dishOriginal,
      body.dishCategory || "main"
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: "E_AI_ERROR", reason: result.error },
        { status: 422, headers: corsHeaders }
      );
    }

    // Cache and return
    const freeEvent = isFreeEventActive();
    await setCache(dishKey, result.data as unknown as object);
    return NextResponse.json(
      { ...result.data as DishDetail, _freeEvent: freeEvent },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Detail API error:", err);
    return NextResponse.json(
      { error: "E_UNKNOWN", reason: err instanceof Error ? err.message : "Internal error", _debug: `detail:POST` },
      { status: 500, headers: corsHeaders }
    );
  }
}
