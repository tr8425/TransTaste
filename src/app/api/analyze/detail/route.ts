import { NextRequest, NextResponse } from "next/server";
import { fetchDishDetail } from "@/lib/ai/claude";
import { MenuInput } from "@/lib/ai/provider";
import { InputType, DishDetail } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { createHash } from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  INPUT_LIMITS,
  checkLanguage,
  checkMenuInput,
  checkString,
  checkStringList,
  clientIp,
  limiterRequired,
  rejectUntrustedRequest,
  securityLog,
} from "@/lib/api-guard";

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

function isFreeEventActive(): boolean {
  const until = process.env.FREE_EVENT_UNTIL;
  if (!until) return false;
  const deadline = new Date(until + "T23:59:59");
  return !isNaN(deadline.getTime()) && new Date() <= deadline;
}

function buildDishCacheKey(phase1Key: string, dishOriginal: string): string {
  return createHash("sha256")
    .update(`detail:${phase1Key}:${dishOriginal}`)
    .digest("hex");
}

function badRequest(reason: string) {
  return NextResponse.json({ error: "E_BAD_REQUEST", reason }, { status: 400 });
}

const VALID_INPUT_TYPES: InputType[] = ["image", "url", "text"];

export async function POST(request: NextRequest) {
  try {
    const rejected = rejectUntrustedRequest(request, "detail");
    if (rejected) return rejected;

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
        { status: 503 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return badRequest("Invalid JSON");
    }
    if (!body || typeof body !== "object") return badRequest("Invalid JSON");

    const inputType = (body.inputType || "image") as InputType;
    if (!VALID_INPUT_TYPES.includes(inputType)) return badRequest("Invalid inputType");
    const input = checkMenuInput(body.input, inputType);
    if (!input.ok) return badRequest(input.reason);
    const dishOriginal = checkString(body.dishOriginal, "dishOriginal", INPUT_LIMITS.dishNameChars, true);
    if (!dishOriginal.ok || !dishOriginal.value) return badRequest(dishOriginal.ok ? "Missing 'dishOriginal'" : dishOriginal.reason);
    const dishCategory = checkString(body.dishCategory, "dishCategory", INPUT_LIMITS.categoryChars);
    if (!dishCategory.ok) return badRequest(dishCategory.reason);
    const outputLanguage = checkLanguage(body.outputLanguage);
    if (!outputLanguage.ok) return badRequest(outputLanguage.reason);
    const allergenPreset = checkStringList(body.allergenPreset, "allergenPreset");
    if (!allergenPreset.ok) return badRequest(allergenPreset.reason);
    const dietaryBeliefs = checkStringList(body.dietaryBeliefs, "dietaryBeliefs");
    if (!dietaryBeliefs.ok) return badRequest(dietaryBeliefs.reason);

    if (!apiKey) {
      return NextResponse.json({ ...DEMO_DETAIL, demo: true });
    }

    // Rate limit by IP — 30 detail requests per hour. Only paid calls reach this point.
    const ip = clientIp(request);
    const rl = await checkRateLimit(`detail:${ip}`, 30, 3600);
    if (rl.unavailable && limiterRequired()) {
      securityLog("rate_limiter_unavailable", { route: "detail" });
      return NextResponse.json(
        { error: "E_SERVICE_UNAVAILABLE", reason: "Dish detail analysis is temporarily unavailable." },
        { status: 503 }
      );
    }
    if (!rl.allowed) {
      securityLog("rate_limited", { route: "detail", ip });
      return NextResponse.json(
        { error: "E_RATE_LIMIT", reason: `Too many requests. Try again in ${Math.ceil(rl.reset / 60)} minutes.` },
        { status: 429, headers: { "Retry-After": String(rl.reset) } }
      );
    }

    // Build cache keys
    const phase1Key = buildCacheKey({
      input: input.value,
      inputType,
      srcLang: "auto",
      tgtLang: outputLanguage.value || "en",
      allergenPreset: allergenPreset.value,
      dietaryBeliefs: dietaryBeliefs.value,
    });
    const dishKey = buildDishCacheKey(phase1Key, dishOriginal.value);

    // Check cache
    const cached = await getCached(dishKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch from Claude
    const menuInput: MenuInput = {
      input: input.value,
      inputType,
      outputLanguage: outputLanguage.value,
      allergenPreset: allergenPreset.value,
      dietaryBeliefs: dietaryBeliefs.value,
      apiKey,
    };

    const result = await fetchDishDetail(
      menuInput,
      dishOriginal.value,
      dishCategory.value || "main"
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: "E_AI_ERROR", reason: "Could not analyze this dish. Please try again." },
        { status: 422 }
      );
    }

    // Cache and return
    const freeEvent = isFreeEventActive();
    await setCache(dishKey, result.data as unknown as object);
    return NextResponse.json({ ...result.data as DishDetail, _freeEvent: freeEvent });
  } catch (err) {
    console.error("Detail API error:", err);
    return NextResponse.json(
      { error: "E_UNKNOWN", reason: "Internal error" },
      { status: 500 }
    );
  }
}
