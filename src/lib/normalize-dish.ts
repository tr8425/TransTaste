import type { DishEnrichment, DishLite, MenuAnalysisResult } from "./types";
import { parseMenuPrice } from "./price";

// The model sometimes omits fields (e.g. `dietary` on drinks). UI code reads
// them unguarded, so every dish passes through here on the server and again on
// the client (cached and history results may predate this normalization).

const RISKS = new Set(["danger", "warning", "check", "safe"]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const TIERS = new Set(["budget", "mid", "premium"]);

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : value == null ? fallback : String(value);
const strOrNull = (value: unknown): string | null =>
  value == null || value === "" ? null : String(value);
const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v) => typeof v === "string" && v.trim()).map((v) => v.trim()) : [];
const bool = (value: unknown): boolean => value === true;

export function normalizeDish(raw: unknown): DishLite | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const original = str(d.original).trim();
  if (!original) return null;

  const t = (d.translation && typeof d.translation === "object" ? d.translation : {}) as Record<string, unknown>;
  const dietary = (d.dietary && typeof d.dietary === "object" ? d.dietary : {}) as Record<string, unknown>;
  const allergens = strList(d.allergens);
  const risk = str(d.allergen_risk);
  const pending = d.analysis_pending === true;
  const currency = strOrNull(d.currency);
  const price = parseMenuPrice(d.price, currency);

  return {
    ...(d as object),
    original,
    // Plain "6.5" from "6,50", so parseFloat works downstream; the menu's own
    // formatting stays in price_display.
    price: price == null ? null : String(price),
    currency,
    price_display: strOrNull(d.price_display),
    language_detected: str(d.language_detected, "unknown"),
    translation: {
      ...(t as object),
      literal: str(t.literal),
      meaning: str(t.meaning),
      english: str(t.english, original),
      pronunciation: strOrNull(t.pronunciation),
    } as DishLite["translation"],
    confidence: (CONFIDENCE.has(str(d.confidence)) ? d.confidence : "medium") as DishLite["confidence"],
    category: str(d.category, "main") || "main",
    dietary: {
      halal: dietary.halal === true ? true : dietary.halal === false ? false : null,
      vegan: bool(dietary.vegan),
      vegetarian: bool(dietary.vegetarian),
      gluten_free: bool(dietary.gluten_free),
    },
    allergens,
    // Unknown risk with listed allergens, or a dish not analyzed yet, should
    // prompt a check, never read as safe.
    allergen_risk: (pending ? "check" : RISKS.has(risk) ? risk : allergens.length ? "check" : "safe") as DishLite["allergen_risk"],
    analysis_pending: pending || undefined,
    alternative_dishes: strList(d.alternative_dishes),
    estimated_calories: typeof d.estimated_calories === "number" && Number.isFinite(d.estimated_calories) ? d.estimated_calories : null,
    price_tier: (TIERS.has(str(d.price_tier)) ? d.price_tier : "mid") as DishLite["price_tier"],
    image_search_query: str(d.image_search_query, original),
  } as DishLite;
}

export function normalizeDishes(raw: unknown): DishLite[] {
  const dishes = Array.isArray(raw) ? raw.map(normalizeDish).filter((d): d is DishLite => d !== null) : [];
  // Names are not unique (the same dish can appear in two sections), so every
  // dish gets an id for matching enrichment. Existing ids are kept.
  const taken = new Set(dishes.map((d) => d.item_id).filter(Boolean));
  let next = 0;
  return dishes.map((d) => {
    if (d.item_id) return d;
    while (taken.has(`d${next}`)) next++;
    taken.add(`d${next}`);
    return { ...d, item_id: `d${next}` };
  });
}

/**
 * An enrichment entry counts only when it carries the safety fields. A partial
 * entry (e.g. only a name) must leave the dish pending, never mark it analyzed
 * with empty allergens, which would read as safe.
 */
export function isCompleteEnrichment(e: unknown): e is DishEnrichment {
  if (!e || typeof e !== "object") return false;
  const x = e as Record<string, unknown>;
  const dietary = x.dietary as Record<string, unknown> | undefined;
  return (
    typeof x.id === "string" &&
    Array.isArray(x.allergens) &&
    x.allergens.every((a) => typeof a === "string") &&
    RISKS.has(String(x.allergen_risk)) &&
    !!dietary && typeof dietary === "object" &&
    typeof dietary.vegan === "boolean" &&
    typeof dietary.vegetarian === "boolean"
  );
}

/**
 * Applies enrichment entries to list dishes (matched by id) and clears their
 * pending flag. Dishes without a complete matching entry stay pending.
 */
export function mergeEnrichment(dishes: DishLite[], entries: DishEnrichment[]): DishLite[] {
  const byId = new Map(entries.filter(isCompleteEnrichment).map((e) => [e.id, e]));
  return dishes.map((dish) => {
    const e = dish.item_id ? byId.get(dish.item_id) : undefined;
    if (!e) return dish;
    const { id: _id, original: _original, literal, ...fields } = e;
    void _id;
    void _original;
    return normalizeDish({
      ...dish,
      ...fields,
      translation: { ...dish.translation, ...(literal ? { literal } : {}) },
      analysis_pending: false,
    }) ?? dish;
  });
}

/** Returns the result with every dish normalized; leaves non-result objects untouched. */
export function normalizeAnalysisResult<T>(result: T): T {
  if (!result || typeof result !== "object" || !Array.isArray((result as { dishes?: unknown }).dishes)) return result;
  const r = result as unknown as MenuAnalysisResult;
  return { ...r, dishes: normalizeDishes(r.dishes) } as unknown as T;
}
