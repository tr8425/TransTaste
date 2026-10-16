import { NextRequest } from "next/server";
import { ENRICH_CHUNK_MAX, enrichDishes } from "@/lib/ai/claude";
import { MenuInput } from "@/lib/ai/provider";
import { DishEnrichment, InputType } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { checkDailyBudget, checkRateLimit } from "@/lib/rate-limit";
import {
  INPUT_LIMITS,
  checkLanguage,
  checkMenuInput,
  checkStringList,
  clientIp,
  limiterRequired,
  rejectUntrustedRequest,
  securityLog,
} from "@/lib/api-guard";
import { isAdminRequest } from "@/lib/admin-session";
import { RequestLog, describeMenuInput } from "@/lib/telemetry";

// Second step of a streaming scan: allergen, diet and calorie fields for a
// chunk of dishes from the list step. The client sends chunks in parallel.

const VALID_INPUT_TYPES: InputType[] = ["image", "url", "text"];

type RequestedDish = { id: string; original: string; category?: string };

function demoEnrichment(dishes: RequestedDish[]): DishEnrichment[] {
  return dishes.map(({ id, original }) => ({
    id,
    original,
    confidence: "low",
    dietary: { halal: null, vegan: false, vegetarian: false, gluten_free: false },
    allergens: [],
    allergen_risk: "check",
    alternative_dishes: [],
    estimated_calories: null,
    price_tier: "mid",
    image_search_query: original,
  }));
}

function checkDishList(value: unknown): { ok: true; value: RequestedDish[] } | { ok: false; reason: string } {
  if (!Array.isArray(value) || value.length === 0) return { ok: false, reason: "Missing 'dishes'" };
  if (value.length > ENRICH_CHUNK_MAX) return { ok: false, reason: `At most ${ENRICH_CHUNK_MAX} dishes per request` };
  const out: RequestedDish[] = [];
  const ids = new Set<string>();
  for (const item of value) {
    const d = (item && typeof item === "object" ? item : {}) as { id?: unknown; original?: unknown; category?: unknown };
    if (typeof d.id !== "string" || !/^[A-Za-z0-9_-]{1,40}$/.test(d.id)) return { ok: false, reason: "Each dish needs an 'id'" };
    if (ids.has(d.id)) return { ok: false, reason: "Duplicate dish 'id'" };
    ids.add(d.id);
    if (typeof d.original !== "string" || !d.original.trim()) return { ok: false, reason: "Each dish needs 'original'" };
    if (d.original.length > INPUT_LIMITS.dishNameChars) return { ok: false, reason: "Dish name is too long" };
    out.push({
      id: d.id,
      original: d.original.trim(),
      category: typeof d.category === "string" ? d.category.slice(0, INPUT_LIMITS.categoryChars) : undefined,
    });
  }
  return { ok: true, value: out };
}

export async function POST(request: NextRequest) {
  const log = new RequestLog("enrich", request);
  const badRequest = (reason: string) =>
    log.respond({ error: "E_BAD_REQUEST", reason }, { status: 400 });
  try {
    const rejected = rejectUntrustedRequest(request, "enrich");
    if (rejected) {
      await log.finish({ status: rejected.status, code: rejected.status === 403 ? "E_FORBIDDEN" : "E_BAD_REQUEST" });
      return rejected;
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
    const dishes = checkDishList(body.dishes);
    if (!dishes.ok) return badRequest(dishes.reason);
    const outputLanguage = checkLanguage(body.outputLanguage);
    if (!outputLanguage.ok) return badRequest(outputLanguage.reason);
    const allergenPreset = checkStringList(body.allergenPreset, "allergenPreset");
    if (!allergenPreset.ok) return badRequest(allergenPreset.reason);
    const dietaryBeliefs = checkStringList(body.dietaryBeliefs, "dietaryBeliefs");
    if (!dietaryBeliefs.ok) return badRequest(dietaryBeliefs.reason);
    const dislikedIngredients = checkStringList(body.dislikedIngredients, "dislikedIngredients");
    if (!dislikedIngredients.ok) return badRequest(dislikedIngredients.reason);
    log.set({
      dish_count: dishes.value.length,
      output_language: outputLanguage.value || "en",
      allergen_count: allergenPreset.value?.length ?? 0,
      dietary_count: dietaryBeliefs.value?.length ?? 0,
      disliked_count: dislikedIngredients.value?.length ?? 0,
    });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      if (process.env.ENABLE_DEMO_ANALYSIS === "true") {
        log.set({ demo: true });
        return log.respond({ dishes: demoEnrichment(dishes.value), demo: true });
      }
      return log.respond(
        { error: "E_SERVICE_UNAVAILABLE", reason: "Menu analysis is not configured." },
        { status: 503 },
      );
    }

    // 60 chunks per hour per IP: a 60-dish menu is 3 chunks, so this covers many scans.
    const ip = clientIp(request);
    const isAdmin = isAdminRequest(request);
    log.set({ admin: isAdmin });
    const rl = isAdmin
      ? { allowed: true, remaining: Infinity, reset: 0, unavailable: false }
      : await checkRateLimit(`enrich:${ip}`, 60, 3600);
    if (rl.unavailable && limiterRequired()) {
      securityLog("rate_limiter_unavailable", { route: "enrich" });
      return log.respond(
        { error: "E_SERVICE_UNAVAILABLE", reason: "Menu analysis is temporarily unavailable." },
        { status: 503 },
      );
    }
    if (!rl.allowed) {
      securityLog("rate_limited", { route: "enrich", ip });
      return log.respond(
        { error: "E_RATE_LIMIT", reason: `Too many requests. Try again in ${Math.ceil(rl.reset / 60)} minutes.` },
        { status: 429, headers: { "Retry-After": String(rl.reset) } },
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
      mode: "enrich",
      // Ids, names and categories all shape the answer, so all are key material.
      extra: JSON.stringify(dishes.value.map((d) => [d.id, d.original, d.category ?? null])),
    });
    const cached = await getCached(cacheKey);
    if (cached) {
      log.set({ cache_hit: true });
      return log.respond(cached as Record<string, unknown>);
    }

    if (!isAdmin) {
      const budget = await checkDailyBudget("enrich");
      if (!budget.allowed || (budget.unavailable && limiterRequired())) {
        securityLog("daily_budget_exhausted", { route: "enrich" });
        return log.respond(
          { error: "E_DAILY_LIMIT", reason: "Today's analysis capacity is used up. Please try again tomorrow." },
          { status: 503 },
        );
      }
    }

    const menuInput: MenuInput = {
      input: input.value,
      inputType,
      outputLanguage: outputLanguage.value,
      allergenPreset: allergenPreset.value,
      dietaryBeliefs: dietaryBeliefs.value,
      dislikedIngredients: dislikedIngredients.value,
      apiKey,
      telemetry: log.telemetry,
    };
    const result = await enrichDishes(menuInput, dishes.value);
    if ("error" in result) {
      const status = result.error === "E_AI_RATE_LIMIT" ? 429 : 422;
      return log.respond(result as unknown as Record<string, unknown>, { status });
    }

    log.set({ dishes: result.dishes.length, ...(result.truncated ? { truncated: true } : {}) });
    // A truncated chunk is returned but not cached; the client retries the missing dishes.
    if (!result.truncated) await setCache(cacheKey, result);
    return log.respond(result as unknown as Record<string, unknown>);
  } catch (err) {
    console.error("Enrich API error:", err);
    log.set({ server_error: err instanceof Error ? err.message.slice(0, 300) : String(err) });
    return log.respond({ error: "E_UNKNOWN", reason: "Internal server error" }, { status: 500 });
  }
}
