import { Dish, MenuAnalysisResult, RecentScan } from "./types";

export const MOCK_DISHES: Dish[] = [
  {
    original: "불도장",
    price: "38,000원",
    language_detected: "ko",
    translation: {
      literal: "Buddha Jumps Over the Wall",
      meaning: "Premium seafood stew with abalone and sea cucumber",
      english: "Buddha Jumps Over the Wall",
    },
    confidence: "high",
    category: "main",
    flavor_profile: { sweet: 2, salty: 4, spicy: 1, sour: 1, umami: 5, rich: 5 },
    ingredients: {
      core: ["abalone", "sea cucumber", "shark fin", "pork trotter"],
      common_additions: ["goji berries", "mushrooms"],
      allergens: ["shellfish", "pork"],
    },
    dietary: { halal: false, vegan: false, vegetarian: false, gluten_free: true },
    price_tier: "premium",
    fun_fact:
      "Legend says this dish smells so good that even Buddhist monks would jump over temple walls to get a taste, breaking their vegetarian vows.",
    how_to_eat:
      "Served in a clay pot. Lift the lid and enjoy the aroma first, then start with the broth using a spoon.",
    image_search_query: "Buddha Jumps Over the Wall Chinese soup dish",
  },
  {
    original: "삼겹살",
    price: "15,000원",
    language_detected: "ko",
    translation: {
      literal: "Three-layer meat",
      meaning: "Grilled pork belly",
      english: "Korean Grilled Pork Belly",
    },
    confidence: "high",
    category: "main",
    flavor_profile: { sweet: 1, salty: 3, spicy: 0, sour: 0, umami: 4, rich: 5 },
    ingredients: {
      core: ["pork belly"],
      common_additions: ["lettuce wraps", "garlic", "ssamjang", "kimchi"],
      allergens: ["pork"],
    },
    dietary: { halal: false, vegan: false, vegetarian: false, gluten_free: true },
    price_tier: "mid",
    fun_fact:
      "Samgyeopsal became hugely popular in Korea during the 1997 financial crisis as an affordable way to enjoy meat. Now it's the most consumed pork cut in Korea.",
    how_to_eat:
      "Grill the slices, then wrap in lettuce with garlic, ssamjang paste, and a slice of grilled kimchi. Eat in one bite.",
    image_search_query: "Korean samgyeopsal grilled pork belly BBQ",
  },
  {
    original: "된장찌개",
    price: "9,000원",
    language_detected: "ko",
    translation: {
      literal: "Soybean paste stew",
      meaning: "Fermented soybean paste stew with tofu and vegetables",
      english: "Korean Soybean Paste Stew",
    },
    confidence: "high",
    category: "soup",
    flavor_profile: { sweet: 1, salty: 4, spicy: 2, sour: 0, umami: 5, rich: 3 },
    ingredients: {
      core: ["doenjang (soybean paste)", "tofu", "zucchini", "onion"],
      common_additions: ["mushrooms", "green chili", "anchovy broth"],
      allergens: ["soy"],
    },
    dietary: { halal: true, vegan: false, vegetarian: false, gluten_free: true },
    price_tier: "budget",
    fun_fact:
      "Korean doenjang (fermented soybean paste) is aged for months to years in traditional clay pots called onggi, exposed to sunlight and wind.",
    how_to_eat:
      "Served bubbling hot in a stone pot with rice on the side. Scoop stew over rice, or eat alternately.",
    image_search_query: "Korean doenjang jjigae soybean paste stew",
  },
  {
    original: "비빔냉면",
    price: "12,000원",
    language_detected: "ko",
    translation: {
      literal: "Mixed cold noodles",
      meaning: "Spicy cold buckwheat noodles",
      english: "Spicy Cold Noodles",
    },
    confidence: "high",
    category: "noodle",
    flavor_profile: { sweet: 2, salty: 2, spicy: 4, sour: 3, umami: 2, rich: 1 },
    ingredients: {
      core: ["buckwheat noodles", "gochujang sauce", "cucumber", "boiled egg"],
      common_additions: ["pear slices", "radish kimchi"],
      allergens: ["egg", "gluten"],
    },
    dietary: { halal: true, vegan: false, vegetarian: false, gluten_free: false },
    price_tier: "mid",
    fun_fact:
      "Naengmyeon was originally a winter dish from North Korea, eaten with the logic that cold food cools the body. Now it's Korea's favorite summer dish.",
    how_to_eat:
      "Cut the long noodles with scissors (provided), mix thoroughly with the sauce, then add vinegar and mustard to taste.",
    image_search_query: "Korean bibim naengmyeon spicy cold noodles",
  },
  {
    original: "막걸리",
    price: "4,000원",
    language_detected: "ko",
    translation: {
      literal: "Roughly filtered (alcohol)",
      meaning: "Traditional Korean rice wine",
      english: "Makgeolli (Korean Rice Wine)",
    },
    confidence: "high",
    category: "drink",
    flavor_profile: { sweet: 3, salty: 0, spicy: 0, sour: 2, umami: 1, rich: 2 },
    ingredients: {
      core: ["rice", "nuruk (fermentation starter)", "water"],
      allergens: ["gluten"],
    },
    dietary: { halal: false, vegan: true, vegetarian: true, gluten_free: false },
    price_tier: "budget",
    fun_fact:
      "Makgeolli is a living drink with active lactobacillus cultures, similar to yogurt. It continues fermenting in the bottle!",
    how_to_eat:
      "Shake the bottle gently before pouring (sediment settles). Pour into a bowl-shaped cup. Pairs perfectly with pajeon (green onion pancake).",
    image_search_query: "Korean makgeolli rice wine traditional bowl",
  },
];

export const MOCK_MENU_RESULT: MenuAnalysisResult = {
  menu_language: "Korean",
  restaurant_type: "Korean Traditional / BBQ",
  items_found: 5,
  dishes: MOCK_DISHES,
  recommended_combo: {
    budget: {
      items: ["된장찌개", "막걸리"],
      reason:
        "A hearty stew with a refreshing rice wine — the classic Korean comfort combo under 15,000 won.",
    },
    balanced: {
      items: ["삼겹살", "된장찌개", "비빔냉면"],
      reason:
        "BBQ for the main event, stew for warmth, cold noodles to refresh the palate between bites.",
    },
  },
};

export const MOCK_RECENT_SCANS: RecentScan[] = [
  { original: "ผัดไทย", english: "Pad Thai", scannedAt: "2h ago" },
  { original: "とんこつラーメン", english: "Tonkotsu Ramen", scannedAt: "Yesterday" },
  { original: "佛跳墙", english: "Buddha Jumps Over the Wall", scannedAt: "3d ago" },
];
