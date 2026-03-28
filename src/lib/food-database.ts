export interface FoodEntry {
  slug: string;
  original: string;
  english: string;
  cuisine: string;
  category: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  fun_fact?: string;
  how_to_eat?: string;
}

// Seed data — expand with hit_count-based popular dishes over time
export const FOOD_DATABASE: Record<string, FoodEntry> = {
  bulgogi: {
    slug: "bulgogi",
    original: "불고기",
    english: "Bulgogi",
    cuisine: "Korean",
    category: "main",
    description:
      "Thinly sliced beef marinated in a sweet soy sauce mixture with garlic, sesame oil, and pear juice, then grilled or stir-fried. One of Korea's most iconic dishes.",
    ingredients: ["beef", "soy sauce", "sesame oil", "garlic", "pear", "sugar"],
    allergens: ["soy", "sesame"],
    fun_fact:
      "The name literally means 'fire meat' (bul = fire, gogi = meat). It dates back to the Goguryeo era (37 BC–668 AD) when it was called 'maekjeok'.",
    how_to_eat:
      "Wrap grilled meat in lettuce leaves with a dab of ssamjang (fermented bean paste) and sliced garlic.",
  },
  bibimbap: {
    slug: "bibimbap",
    original: "비빔밥",
    english: "Bibimbap",
    cuisine: "Korean",
    category: "rice",
    description:
      "A colorful rice bowl topped with sautéed vegetables, a fried egg, sliced meat, and gochujang (red pepper paste). Mixed thoroughly before eating.",
    ingredients: ["rice", "vegetables", "egg", "beef", "gochujang", "sesame oil"],
    allergens: ["egg", "soy", "sesame"],
    fun_fact:
      "Bibimbap means 'mixed rice'. It originated as a way to use up leftover side dishes before the new year.",
    how_to_eat:
      "Add gochujang to taste, then mix everything together vigorously with a spoon before eating.",
  },
  "pad-thai": {
    slug: "pad-thai",
    original: "ผัดไทย",
    english: "Pad Thai",
    cuisine: "Thai",
    category: "noodle",
    description:
      "Stir-fried rice noodles with shrimp or chicken, eggs, bean sprouts, and crushed peanuts in a tamarind-based sauce. Thailand's national dish.",
    ingredients: ["rice noodles", "shrimp", "egg", "bean sprouts", "peanuts", "tamarind"],
    allergens: ["shellfish", "egg", "peanuts"],
    fun_fact:
      "Pad Thai was promoted as a national dish in the 1930s-40s by Prime Minister Plaek Phibunsongkhram as part of a nation-building campaign.",
    how_to_eat:
      "Squeeze fresh lime over it, add chili flakes to taste, and eat with a fork and spoon (not chopsticks — this is the Thai way).",
  },
  ramen: {
    slug: "ramen",
    original: "ラーメン",
    english: "Ramen",
    cuisine: "Japanese",
    category: "noodle",
    description:
      "Japanese wheat noodles in a rich broth (pork, chicken, soy, or miso-based) topped with sliced pork, soft-boiled egg, nori, and green onions.",
    ingredients: ["wheat noodles", "pork broth", "chashu pork", "egg", "nori", "green onion"],
    allergens: ["gluten", "egg", "soy"],
    fun_fact:
      "Slurping ramen is not just acceptable in Japan — it's encouraged. The slurping cools the noodles and is said to enhance the flavor.",
    how_to_eat:
      "Eat noodles first (they get soggy). Slurp freely. Use the spoon for broth. Drink remaining broth from the bowl.",
  },
  "tom-yum-goong": {
    slug: "tom-yum-goong",
    original: "ต้มยำกุ้ง",
    english: "Tom Yum Goong",
    cuisine: "Thai",
    category: "soup",
    description:
      "A hot and sour Thai soup with shrimp, lemongrass, galangal, kaffir lime leaves, and chili. Famous for its bold, layered flavors.",
    ingredients: ["shrimp", "lemongrass", "galangal", "kaffir lime", "chili", "fish sauce"],
    allergens: ["shellfish", "fish"],
    fun_fact:
      "Tom Yum was submitted for UNESCO Intangible Cultural Heritage recognition. 'Tom' means boiling, 'Yum' means mixed, 'Goong' means shrimp.",
    how_to_eat:
      "Eat the shrimp and mushrooms. The lemongrass, galangal, and kaffir lime leaves are for flavor — don't eat them.",
  },
};
