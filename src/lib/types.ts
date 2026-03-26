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

export interface Dish {
  original: string;
  price: string | null;
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
  fun_fact: string;
  how_to_eat: string | null;
  image_search_query: string;
}

export interface MenuAnalysisResult {
  menu_language: string;
  restaurant_type: string;
  items_found: number;
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
