export interface FlavorProfile {
  sweet: number;
  salty: number;
  spicy: number;
  sour: number;
  umami: number;
  rich: number;
}

export interface Translation {
  literal: string;
  meaning: string;
  english: string;
  pronunciation?: string;
}

// --- v2 types ---

export interface FunFactDetail {
  label: string;
  content: string;
}

export interface DishWarning {
  level: 'taste' | 'intensity' | 'texture' | 'alcohol' | null;
  message: string;
}

export interface Disclosure {
  target_culture: string;
  message: string;
}

export interface AllergenRiskDetail {
  ingredient: string;
  risk_level: 'main' | 'sub' | 'possible';
}

export interface AllergenSummary {
  preset_triggered: string[];
  overall_risk: 'danger' | 'warning' | 'check' | 'safe';
  risk_details: AllergenRiskDetail[];
  alternative_dishes?: string[];
}

export interface MenuOption {
  label: string;
  type: 'single' | 'multi' | 'addon';
  required: boolean;
  choices: {
    name: string;
    name_translated: string;
    price_delta?: number;
    allergens?: string[];
  }[];
}

export type InputType = 'image' | 'url' | 'text';

/**
 * Unified error codes — every error in the scan flow maps to one of these.
 *
 * Client-side (loading-scan):
 *   E_NO_INPUT      — sessionStorage has no scan data
 *   E_NO_CREDITS    — user ran out of free scans / pass expired
 *   E_TIMEOUT       — 3-minute SSE timeout
 *   E_STREAM_END    — SSE stream closed without done/error event
 *   E_FETCH_FAIL    — fetch() threw (network offline, CORS, etc.)
 *
 * API route:
 *   E_RATE_LIMIT    — IP rate limit exceeded (429)
 *   E_BAD_REQUEST   — invalid JSON, missing input, bad inputType
 *   E_AUTH          — API key invalid or missing (401)
 *
 * AI provider (claude.ts):
 *   E_NOT_MENU      — image is not a food menu
 *   E_OCR_FAIL      — image too blurry / unreadable
 *   E_NO_TEXT       — no menu items identified
 *   E_PARTIAL       — partial read (some items only)
 *   E_PARSE_FAIL    — AI returned unparseable JSON
 *   E_AI_RATE_LIMIT — Anthropic 429
 *   E_AI_ERROR      — other Anthropic API error
 *   E_MAX_TOKENS    — response truncated by token limit
 *   E_UNKNOWN       — catch-all
 */
export type ErrorCode =
  // client
  | 'E_NO_INPUT'
  | 'E_NO_CREDITS'
  | 'E_TIMEOUT'
  | 'E_STREAM_END'
  | 'E_FETCH_FAIL'
  // api route
  | 'E_RATE_LIMIT'
  | 'E_BAD_REQUEST'
  | 'E_AUTH'
  // ai provider
  | 'E_NOT_MENU'
  | 'E_OCR_FAIL'
  | 'E_NO_TEXT'
  | 'E_PARTIAL'
  | 'E_PARSE_FAIL'
  | 'E_AI_RATE_LIMIT'
  | 'E_AI_ERROR'
  | 'E_MAX_TOKENS'
  | 'E_UNKNOWN'
  // legacy compat (AI prompt still returns these)
  | 'not_menu'
  | 'no_text'
  | 'ocr_failed'
  | 'low_confidence'
  | 'partial'
  | 'network_error'
  | 'rate_limited';

export interface AnalysisError {
  error: ErrorCode;
  reason: string;
  /** Debug-only: HTTP status or internal detail */
  _debug?: string;
}

export type AnalysisResponse = MenuAnalysisResult | AnalysisError;

export function isAnalysisError(res: AnalysisResponse): res is AnalysisError {
  return 'error' in res;
}

// --- end v2 types ---

// === Phase 1: Lite dish for list view (streamed fast) ===
export interface DishLite {
  original: string;
  price: string | null;
  currency: string | null;        // ISO 4217 code (KRW, JPY, USD, THB...)
  price_display: string | null;   // Formatted: ₩17,000, ¥1,200, $14.00
  language_detected: string;
  translation: Translation;
  confidence: "high" | "medium" | "low";
  category: string;
  dietary: {
    halal: boolean | null;
    vegan: boolean;
    vegetarian: boolean;
    gluten_free?: boolean;
  };
  allergens: string[]; // flattened from ingredients.allergens
  allergen_risk: 'danger' | 'warning' | 'check' | 'safe';
  alternative_dishes?: string[];
  disliked_ingredients?: string[];
  estimated_calories?: number | null;
  price_tier: "budget" | "mid" | "premium";
  image_search_query: string;
}

// === Phase 2: Detail fetched on demand per dish ===
export interface DishDetail {
  flavor_profile: FlavorProfile;
  ingredients: {
    core: string[];
    common_additions?: string[];
    allergens: string[];
  };
  fun_fact: string | null;
  fun_fact_detail?: FunFactDetail | null;
  how_to_eat: string | null;
  warning?: DishWarning | null;
  disclosure?: Disclosure | null;
  has_brand_name?: boolean;
  brand_part?: string;
  brand_note?: string;
  food_part?: string;
  has_customization?: boolean;
  options?: MenuOption[];
  allergen_summary?: AllergenSummary;
}

export interface MenuMeta {
  language: string;
  restaurant_type: string;
  country_detected: string;
  items_found: number;
}

export interface MenuAnalysisResult {
  menu_meta?: MenuMeta;
  // Keep old flat fields as optional for backwards compatibility
  menu_language?: string;
  restaurant_type?: string;
  items_found?: number;
  dishes: DishLite[];
  recommended_combo: {
    budget: { items: string[]; reason: string };
    balanced: { items: string[]; reason: string };
  };
  /** True when response is mock/demo data (no API key configured) */
  demo?: boolean;
}

export type AllergenType =
  | "shellfish"
  | "pork"
  | "gluten"
  | "dairy"
  | "nuts"
  | "egg"
  | "soy";

export type DietaryLabel = "vegan" | "vegetarian" | "halal" | "gluten-free";

export interface CreditState {
  remaining: number;
  hasPass: boolean;
  passType?: "7d" | "30d";
  passExpiresAt?: string;
}

export interface RecentScan {
  original: string;
  english: string;
  scannedAt: string | Date;
  /** Key to look up cached MenuAnalysisResult in localStorage */
  resultKey?: string;
}
