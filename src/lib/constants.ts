export const BRAND = {
  primary: "#D85A30",
  primaryLight: "#E8764D",
  background: "#FDFAF5",
  surface: "#F8F6F2",
  textPrimary: "#2C1A0E",
  textSecondary: "#8B6A50",
  accent: "#BA7517",
  success: "#639922",
  danger: "#E24B4A",
} as const;

export const ALLERGEN_COLORS: Record<string, { bg: string; text: string }> = {
  shellfish: { bg: "#FEE2E2", text: "#DC2626" },
  pork: { bg: "#FEF3C7", text: "#D97706" },
  gluten: { bg: "#FEF3C7", text: "#D97706" },
  dairy: { bg: "#FEE2E2", text: "#DC2626" },
  nuts: { bg: "#FEE2E2", text: "#DC2626" },
  egg: { bg: "#FEF3C7", text: "#D97706" },
  soy: { bg: "#FEF3C7", text: "#D97706" },
};

export const DIETARY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  vegan: { label: "Vegan", color: "#639922", bg: "#ECFCCB" },
  vegetarian: { label: "Vegetarian", color: "#639922", bg: "#ECFCCB" },
  halal: { label: "Halal", color: "#639922", bg: "#ECFCCB" },
  "gluten-free": { label: "Gluten-Free", color: "#639922", bg: "#ECFCCB" },
};

export const FLAVOR_AXES = [
  "umami",
  "salty",
  "sweet",
  "sour",
  "spicy",
  "rich",
] as const;


export const CATEGORY_FILTERS = [
  "all",
  "main",
  "soup",
  "noodle",
  "rice",
  "side",
  "drink",
  "dessert",
] as const;

export const FUN_FACTS_LOADING_COUNT = 10;
