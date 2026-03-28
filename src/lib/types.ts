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

export interface AnalysisError {
  error: 'not_menu' | 'no_text' | 'ocr_failed' | 'low_confidence' | 'partial' | 'network_error';
  reason: string;
}

export type AnalysisResponse = MenuAnalysisResult | MenuAnalysisResultLite | AnalysisError;

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
  disliked_ingredients?: string[];
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

// Phase 1 result shape
export interface MenuAnalysisResultLite {
  menu_meta?: MenuMeta;
  menu_language?: string;
  restaurant_type?: string;
  items_found?: number;
  dishes: DishLite[];
  recommended_combo: {
    budget: { items: string[]; reason: string };
    balanced: { items: string[]; reason: string };
  };
}

// === Legacy full dish (kept for backwards compat) ===
export interface Dish {
  original: string;
  price: string | null;
  currency?: string | null;
  price_display?: string | null;
  language_detected: string;
  translation: Translation;
  confidence: "high" | "medium" | "low";
  category: string;
  flavor_profile: FlavorProfile;
  ingredients: {
    core: string[];
    common_additions?: string[];
    allergens: string[];
  };
  dietary: {
    halal: boolean | null;
    vegan: boolean;
    vegetarian: boolean;
    gluten_free?: boolean;
  };
  price_tier: "budget" | "mid" | "premium";
  fun_fact: string | null;
  how_to_eat: string | null;
  image_search_query: string;
  // v2 optional fields
  has_brand_name?: boolean;
  brand_part?: string;
  brand_note?: string;
  food_part?: string;
  fun_fact_detail?: FunFactDetail | null;
  warning?: DishWarning | null;
  disclosure?: Disclosure | null;
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
  dishes: Dish[];
  recommended_combo: {
    budget: { items: string[]; reason: string };
    balanced: { items: string[]; reason: string };
  };
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
  scannedAt: string;
}
