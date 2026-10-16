import { NextRequest } from "next/server";
import { fetchDishDetail } from "@/lib/ai/claude";
import { MenuInput } from "@/lib/ai/provider";
import { InputType, DishDetail } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { createHash } from "crypto";
import { checkDailyBudget, checkRateLimit } from "@/lib/rate-limit";
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
import { isAdminRequest } from "@/lib/admin-session";
import { RequestLog, describeMenuInput } from "@/lib/telemetry";

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


const VALID_INPUT_TYPES: InputType[] = ["image", "url", "text"];

export async function POST(request: NextRequest) {
  const log = new RequestLog("detail", request);
  const badRequest = (reason: string) =>
    log.respond({ error: "E_BAD_REQUEST", reason }, { status: 400 });
  try {
    const rejected = rejectUntrustedRequest(request, "detail");
    if (rejected) {
      await log.finish({ status: rejected.status, code: rejected.status === 403 ? "E_FORBIDDEN" : "E_BAD_REQUEST" });
      return rejected;
    }

    // API credentials are server-managed and never accepted from the browser.
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const demoModeEnabled = process.env.ENABLE_DEMO_ANALYSIS === "true";

    // Mock mode — no key at all
    if (!apiKey && !demoModeEnabled) {
      return log.respond(
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
    log.set(describeMenuInput(body.input, inputType));
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
    log.set({
      dish: dishOriginal.value,
      dish_category: dishCategory.value || "main",
      output_language: outputLanguage.value || "en",
      allergen_count: allergenPreset.value?.length ?? 0,
      dietary_count: dietaryBeliefs.value?.length ?? 0,
    });

    if (!apiKey) {
      return log.respond({ ...DEMO_DETAIL, demo: true });
    }

    // Rate limit by IP — 30 detail requests per hour. Only paid calls reach this point.
    // Admin sessions (owner access code) skip the limiter.
    const ip = clientIp(request);
    const isAdmin = isAdminRequest(request);
    log.set({ admin: isAdmin });
    const rl = isAdmin
      ? { allowed: true, remaining: Infinity, reset: 0, unavailable: false }
      : await checkRateLimit(`detail:${ip}`, 30, 3600);
    if (rl.unavailable && limiterRequired()) {
      securityLog("rate_limiter_unavailable", { route: "detail" });
      return log.respond(
        { error: "E_SERVICE_UNAVAILABLE", reason: "Dish detail analysis is temporarily unavailable." },
        { status: 503 }
      );
    }
    if (!rl.allowed) {
      securityLog("rate_limited", { route: "detail", ip });
      return log.respond(
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
      log.set({ cache_hit: true });
      return log.respond(cached as Record<string, unknown>);
    }

    // Site-wide daily cap, counted only for calls that reach the AI (cache hits are free).
    if (!isAdmin) {
      const budget = await checkDailyBudget("detail");
      if (!budget.allowed || (budget.unavailable && limiterRequired())) {
        securityLog("daily_budget_exhausted", { route: "detail" });
        return log.respond(
          { error: "E_DAILY_LIMIT", reason: "Today's analysis capacity is used up. Please try again tomorrow." },
          { status: 503 },
        );
      }
    }

    // Fetch from Claude
    const menuInput: MenuInput = {
      input: input.value,
      inputType,
      outputLanguage: outputLanguage.value,
      allergenPreset: allergenPreset.value,
      dietaryBeliefs: dietaryBeliefs.value,
      apiKey,
      telemetry: log.telemetry,
    };

    const result = await fetchDishDetail(
      menuInput,
      dishOriginal.value,
      dishCategory.value || "main"
    );

    if ("error" in result) {
      log.set({ ai_error: String(result.error).slice(0, 300) });
      return log.respond(
        { error: "E_AI_ERROR", reason: "Could not analyze this dish. Please try again." },
        { status: 422 }
      );
    }

    // Cache and return
    const freeEvent = isFreeEventActive();
    await setCache(dishKey, result.data as unknown as object);
    return log.respond({ ...result.data as DishDetail, _freeEvent: freeEvent });
  } catch (err) {
    console.error("Detail API error:", err);
    log.set({ server_error: err instanceof Error ? err.message.slice(0, 300) : String(err) });
    return log.respond(
      { error: "E_UNKNOWN", reason: "Internal error" },
      { status: 500 }
    );
  }
}
