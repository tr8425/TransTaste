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

  // === Japanese (7) ===
  sushi: {
    slug: "sushi",
    original: "寿司",
    english: "Sushi",
    cuisine: "Japanese",
    category: "main",
    description:
      "Vinegared rice paired with fresh seafood, vegetables, or egg, shaped into nigiri, rolls (maki), or hand-pressed forms. Japan's most famous culinary export.",
    ingredients: ["sushi rice", "rice vinegar", "fish", "nori", "wasabi", "soy sauce"],
    allergens: ["fish", "shellfish", "soy", "gluten"],
    fun_fact:
      "Originally, sushi was a preservation method — fish was packed in fermented rice for months. The rice was discarded and only the fish was eaten.",
    how_to_eat:
      "Dip fish-side down into soy sauce (not the rice). Eat nigiri in one bite. Use fingers or chopsticks — both are acceptable.",
  },
  tempura: {
    slug: "tempura",
    original: "天ぷら",
    english: "Tempura",
    cuisine: "Japanese",
    category: "appetizer",
    description:
      "Seafood and vegetables coated in a light, crispy batter and deep-fried. Served with tentsuyu dipping sauce or salt.",
    ingredients: ["shrimp", "vegetables", "flour", "egg", "dashi", "soy sauce"],
    allergens: ["shellfish", "gluten", "egg", "soy"],
    fun_fact:
      "Tempura was introduced to Japan by Portuguese missionaries in the 16th century. The word may derive from 'tempora', the Latin term for Lenten fasting periods.",
    how_to_eat:
      "Dip lightly in tentsuyu sauce with grated daikon. Eat immediately while hot and crispy — tempura does not wait.",
  },
  okonomiyaki: {
    slug: "okonomiyaki",
    original: "お好み焼き",
    english: "Okonomiyaki",
    cuisine: "Japanese",
    category: "main",
    description:
      "A savory Japanese pancake made with batter, cabbage, and various toppings like pork, seafood, and cheese, cooked on a griddle and drizzled with special sauce and mayo.",
    ingredients: ["flour", "cabbage", "egg", "pork", "okonomiyaki sauce", "mayonnaise", "bonito flakes"],
    allergens: ["gluten", "egg", "fish", "soy"],
    fun_fact:
      "The name means 'grilled as you like it' — okonomi (as you like) + yaki (grilled). Osaka and Hiroshima each have their own rival style.",
    how_to_eat:
      "Cut into wedges with a spatula. In Osaka-style restaurants you cook it yourself on the table griddle. Top with sauce, mayo, and bonito flakes.",
  },
  gyudon: {
    slug: "gyudon",
    original: "牛丼",
    english: "Gyudon",
    cuisine: "Japanese",
    category: "rice",
    description:
      "A comforting bowl of steamed rice topped with thinly sliced beef and onions simmered in a sweet soy-based sauce. Japan's favorite fast food.",
    ingredients: ["beef", "onion", "rice", "soy sauce", "mirin", "dashi"],
    allergens: ["soy", "beef", "gluten"],
    fun_fact:
      "Gyudon chains like Yoshinoya serve over 1 billion bowls per year across Japan. The dish became popular in the Meiji era when beef-eating taboos were lifted.",
    how_to_eat:
      "Add pickled ginger (beni shoga) on top. Crack a raw egg over it for extra richness. Eat with chopsticks and don't be shy about lifting the bowl.",
  },
  "matcha-latte": {
    slug: "matcha-latte",
    original: "抹茶ラテ",
    english: "Matcha Latte",
    cuisine: "Japanese",
    category: "drink",
    description:
      "A creamy beverage made from ceremonial-grade matcha green tea powder whisked with steamed milk. Earthy, slightly bitter, and subtly sweet.",
    ingredients: ["matcha powder", "milk", "sugar"],
    allergens: ["milk"],
    fun_fact:
      "Matcha contains L-theanine, an amino acid that promotes calm alertness — the opposite of coffee jitters. Zen monks drank it for meditation focus.",
    how_to_eat:
      "Stir well before drinking as matcha settles. Enjoy hot or iced. In Japan, it's often paired with wagashi (traditional sweets) to balance the bitterness.",
  },
  "miso-soup": {
    slug: "miso-soup",
    original: "味噌汁",
    english: "Miso Soup",
    cuisine: "Japanese",
    category: "soup",
    description:
      "A traditional Japanese soup made from dashi stock and dissolved miso paste, typically with tofu, wakame seaweed, and green onions.",
    ingredients: ["miso paste", "dashi", "tofu", "wakame", "green onion"],
    allergens: ["soy", "fish"],
    fun_fact:
      "Miso soup is eaten at breakfast by over 75% of Japanese households. The type of miso varies by region — white (shiro) in the west, red (aka) in the east.",
    how_to_eat:
      "Drink the broth directly from the bowl. Use chopsticks to pick out the tofu, seaweed, and other solid ingredients.",
  },
  takoyaki: {
    slug: "takoyaki",
    original: "たこ焼き",
    english: "Takoyaki",
    cuisine: "Japanese",
    category: "appetizer",
    description:
      "Golden ball-shaped snacks made from wheat batter filled with diced octopus, pickled ginger, and green onion, cooked in a special molded pan.",
    ingredients: ["flour", "octopus", "pickled ginger", "green onion", "takoyaki sauce", "mayonnaise", "bonito flakes"],
    allergens: ["gluten", "shellfish", "egg", "fish", "soy"],
    fun_fact:
      "Takoyaki was invented in 1935 by a street vendor in Osaka named Tomekichi Endo. Osaka residents are said to all own a takoyaki pan at home.",
    how_to_eat:
      "Use a toothpick to eat them one at a time. Be careful — the inside is molten hot! Let them cool a moment before biting in.",
  },

  // === Chinese (7) ===
  "mapo-tofu": {
    slug: "mapo-tofu",
    original: "麻婆豆腐",
    english: "Mapo Tofu",
    cuisine: "Chinese",
    category: "main",
    description:
      "Soft tofu cubes in a fiery, numbing sauce of chili bean paste, ground pork, Sichuan peppercorns, and fermented black beans. A signature Sichuan dish.",
    ingredients: ["tofu", "ground pork", "doubanjiang", "Sichuan peppercorn", "garlic", "soy sauce"],
    allergens: ["soy", "pork"],
    fun_fact:
      "Named after a pockmarked (ma) old woman (po) named Chen who invented the dish in 1860s Chengdu. Her roadside restaurant still exists today.",
    how_to_eat:
      "Serve over steamed white rice to balance the heat. Use a spoon — chopsticks struggle with soft tofu. Have rice or a cold drink ready for the spice.",
  },
  "peking-duck": {
    slug: "peking-duck",
    original: "北京烤鸭",
    english: "Peking Duck",
    cuisine: "Chinese",
    category: "main",
    description:
      "Whole duck roasted until the skin is thin, crispy, and lacquered. Served sliced at the table with thin pancakes, scallions, cucumber, and hoisin sauce.",
    ingredients: ["duck", "hoisin sauce", "scallion", "cucumber", "thin pancakes", "sugar"],
    allergens: ["gluten", "soy"],
    fun_fact:
      "Peking Duck dates to the Imperial Ming Dynasty (1368). The most famous restaurant, Quanjude, has been serving it since 1864 and has served over 200 million ducks.",
    how_to_eat:
      "Place a pancake flat, add hoisin sauce, duck skin/meat, scallion strips, and cucumber. Roll it up like a burrito and eat with your hands.",
  },
  xiaolongbao: {
    slug: "xiaolongbao",
    original: "小笼包",
    english: "Xiaolongbao",
    cuisine: "Chinese",
    category: "appetizer",
    description:
      "Delicate steamed soup dumplings with a thin wrapper encasing seasoned pork filling and a burst of rich, hot broth inside.",
    ingredients: ["pork", "flour", "ginger", "soy sauce", "Shaoxing wine", "pork gelatin"],
    allergens: ["gluten", "soy", "pork", "alcohol"],
    fun_fact:
      "The soup inside is created by mixing chilled pork gelatin into the filling — it melts into liquid broth when steamed. Invented in 1870s Shanghai.",
    how_to_eat:
      "Place on a spoon, nibble a small hole in the skin, sip the hot soup carefully, then eat the dumpling. Dip in black vinegar with shredded ginger.",
  },
  "kung-pao-chicken": {
    slug: "kung-pao-chicken",
    original: "宫保鸡丁",
    english: "Kung Pao Chicken",
    cuisine: "Chinese",
    category: "main",
    description:
      "Diced chicken stir-fried with peanuts, dried chili peppers, and Sichuan peppercorns in a savory-sweet-spicy sauce. A beloved Sichuan classic.",
    ingredients: ["chicken", "peanuts", "dried chili", "Sichuan peppercorn", "soy sauce", "vinegar", "sugar"],
    allergens: ["peanuts", "soy"],
    fun_fact:
      "Named after Ding Baozhen, a Qing Dynasty governor (Gong Bao was his official title). The dish was banned during the Cultural Revolution due to its imperial associations.",
    how_to_eat:
      "Eat with steamed rice. The dried chilies are for flavoring — most people don't eat them directly. Enjoy the mix of chicken and crunchy peanuts.",
  },
  "fried-rice": {
    slug: "fried-rice",
    original: "炒饭",
    english: "Fried Rice",
    cuisine: "Chinese",
    category: "rice",
    description:
      "Day-old rice stir-fried at high heat with eggs, vegetables, and protein (shrimp, pork, or chicken), seasoned with soy sauce. A staple across Asia.",
    ingredients: ["rice", "egg", "green onion", "soy sauce", "vegetables", "oil"],
    allergens: ["egg", "soy"],
    fun_fact:
      "The secret to restaurant-quality fried rice is 'wok hei' — the breath of the wok. This smoky flavor requires temperatures exceeding 1,200°C, impossible on home stoves.",
    how_to_eat:
      "Eat with a spoon or chopsticks. It's a complete one-plate meal. Add chili oil or white pepper for extra kick.",
  },
  "hot-pot": {
    slug: "hot-pot",
    original: "火锅",
    english: "Hot Pot",
    cuisine: "Chinese",
    category: "set",
    description:
      "A communal dining experience where a simmering pot of spicy or mild broth sits at the center of the table. Diners cook raw meats, seafood, vegetables, and noodles in the broth.",
    ingredients: ["beef", "lamb", "tofu", "mushrooms", "leafy greens", "noodles", "chili oil", "Sichuan peppercorn"],
    allergens: ["soy", "shellfish", "sesame", "gluten", "beef"],
    fun_fact:
      "Hot pot originated over 1,000 years ago among Mongolian horsemen who cooked meat in their helmets over campfires. Chongqing-style hot pot can have over 30 spices.",
    how_to_eat:
      "Choose a split pot (half spicy, half mild) if unsure about spice. Cook thin meats for 10–15 seconds, vegetables for 2–3 minutes. Mix your own dipping sauce at the sauce bar.",
  },
  "dim-sum": {
    slug: "dim-sum",
    original: "点心",
    english: "Dim Sum",
    cuisine: "Chinese",
    category: "set",
    description:
      "A Cantonese brunch tradition of small steamed, fried, and baked dishes served in bamboo baskets — dumplings, buns, rice rolls, tarts, and more.",
    ingredients: ["shrimp", "pork", "flour", "rice flour", "vegetables", "soy sauce"],
    allergens: ["shellfish", "gluten", "soy", "pork", "sesame"],
    fun_fact:
      "Dim sum means 'touch the heart'. It originated in teahouses along the ancient Silk Road where travelers stopped for tea and small snacks.",
    how_to_eat:
      "Order a variety to share. Pour tea for others before yourself (a sign of respect). Tap two fingers on the table to say 'thank you' when someone pours you tea.",
  },

  // === Vietnamese (4) ===
  pho: {
    slug: "pho",
    original: "Phở",
    english: "Pho",
    cuisine: "Vietnamese",
    category: "noodle",
    description:
      "A fragrant Vietnamese soup with rice noodles in a clear beef or chicken broth simmered for hours with star anise, cinnamon, and cloves, topped with fresh herbs.",
    ingredients: ["rice noodles", "beef", "star anise", "cinnamon", "bean sprouts", "basil", "lime", "fish sauce"],
    allergens: ["fish", "beef"],
    fun_fact:
      "Pho originated in northern Vietnam in the early 1900s, likely influenced by French pot-au-feu. The North vs. South pho debate is as heated as NY vs. Chicago pizza.",
    how_to_eat:
      "Add bean sprouts, basil, lime, and chili to your bowl. Use chopsticks for noodles and a spoon for broth simultaneously — one in each hand.",
  },
  "banh-mi": {
    slug: "banh-mi",
    original: "Bánh mì",
    english: "Banh Mi",
    cuisine: "Vietnamese",
    category: "main",
    description:
      "A crispy Vietnamese baguette filled with pâté, grilled pork or cold cuts, pickled daikon and carrots, cilantro, jalapeño, and mayonnaise.",
    ingredients: ["baguette", "pork", "pâté", "pickled daikon", "carrot", "cilantro", "jalapeño", "mayonnaise"],
    allergens: ["gluten", "egg", "pork"],
    fun_fact:
      "Banh mi is a perfect example of French-Vietnamese fusion — the baguette came from French colonialism, but the fillings are entirely Vietnamese.",
    how_to_eat:
      "Eat it like a sandwich, with napkins ready — the fillings tend to spill. Best enjoyed fresh from a street vendor while the bread is still warm and crispy.",
  },
  "bun-cha": {
    slug: "bun-cha",
    original: "Bún chả",
    english: "Bun Cha",
    cuisine: "Vietnamese",
    category: "noodle",
    description:
      "Hanoi's signature dish of grilled pork patties and sliced pork belly served with rice vermicelli, fresh herbs, and a tangy dipping broth of fish sauce, vinegar, and sugar.",
    ingredients: ["pork patties", "pork belly", "rice vermicelli", "fish sauce", "garlic", "lettuce", "herbs"],
    allergens: ["fish", "pork"],
    fun_fact:
      "Bun cha became world-famous in 2016 when Barack Obama and Anthony Bourdain shared a $6 meal of it at Bun Cha Huong Lien in Hanoi — now called 'the Obama restaurant'.",
    how_to_eat:
      "Dip noodles and herbs into the broth bowl, add pork, and eat together. The broth is for dipping, not drinking like soup.",
  },
  "goi-cuon": {
    slug: "goi-cuon",
    original: "Gỏi cuốn",
    english: "Fresh Spring Rolls",
    cuisine: "Vietnamese",
    category: "appetizer",
    description:
      "Translucent rice paper rolls filled with shrimp, pork, rice vermicelli, lettuce, and fresh herbs. Served cold with peanut or hoisin dipping sauce.",
    ingredients: ["rice paper", "shrimp", "pork", "rice vermicelli", "lettuce", "mint", "peanut sauce"],
    allergens: ["shellfish", "pork", "peanuts"],
    fun_fact:
      "Unlike fried spring rolls, goi cuon are completely uncooked (except the shrimp and pork). They're considered a healthy street food and are often called 'summer rolls' in the West.",
    how_to_eat:
      "Dip generously in peanut sauce or hoisin sauce. Eat in 2–3 bites. They're best eaten immediately — rice paper dries out and cracks if left too long.",
  },

  // === Indian (5) ===
  "butter-chicken": {
    slug: "butter-chicken",
    original: "मुर्ग़ मक्खनी",
    english: "Butter Chicken",
    cuisine: "Indian",
    category: "main",
    description:
      "Tender chicken pieces in a rich, creamy tomato-based sauce with butter, cream, and aromatic spices. Mild and comforting — India's most popular curry worldwide.",
    ingredients: ["chicken", "tomato", "butter", "cream", "garam masala", "ginger", "garlic", "fenugreek"],
    allergens: ["dairy", "milk"],
    fun_fact:
      "Invented in 1950s Delhi by Kundan Lal Gujral of Moti Mahal restaurant, who repurposed leftover tandoori chicken in a tomato-butter gravy. Two Delhi restaurants still dispute the claim.",
    how_to_eat:
      "Scoop with naan bread or pour over basmati rice. Tear naan into pieces and use them to pinch the chicken and sauce. Eat with your right hand in India.",
  },
  biryani: {
    slug: "biryani",
    original: "बिरयानी",
    english: "Biryani",
    cuisine: "Indian",
    category: "rice",
    description:
      "Fragrant basmati rice layered with spiced meat (chicken, lamb, or goat), caramelized onions, saffron, and whole spices, slow-cooked in a sealed pot (dum).",
    ingredients: ["basmati rice", "chicken", "saffron", "fried onions", "yogurt", "cardamom", "cinnamon", "bay leaf"],
    allergens: ["dairy", "milk"],
    fun_fact:
      "Hyderabadi biryani is so revered that the Nizam of Hyderabad once fed it to 10,000 guests. The Lucknow vs. Hyderabad biryani rivalry is one of India's greatest food debates.",
    how_to_eat:
      "Mix the layers gently to combine rice and meat. Eat with raita (yogurt condiment) to balance the spice. Use a spoon or your right hand.",
  },
  dosa: {
    slug: "dosa",
    original: "தோசை",
    english: "Dosa",
    cuisine: "Indian",
    category: "main",
    description:
      "A thin, crispy crepe made from fermented rice and lentil batter, often filled with spiced potato (masala dosa). A South Indian breakfast staple.",
    ingredients: ["rice", "urad dal", "potato", "mustard seeds", "curry leaves", "turmeric", "onion"],
    allergens: [],
    fun_fact:
      "Dosa batter must ferment for 8–12 hours, developing a slight tanginess. The largest dosa ever made was 16.7 meters long, set in Chennai in 2019.",
    how_to_eat:
      "Tear off pieces and dip into coconut chutney and sambar (lentil soup). Start from the edges and work inward. Don't use a fork — hands are traditional.",
  },
  samosa: {
    slug: "samosa",
    original: "समोसा",
    english: "Samosa",
    cuisine: "Indian",
    category: "appetizer",
    description:
      "Crispy triangular pastries filled with spiced potatoes, peas, and sometimes meat, deep-fried to golden perfection. India's most iconic street snack.",
    ingredients: ["flour", "potato", "peas", "cumin", "coriander", "green chili", "oil"],
    allergens: ["gluten"],
    fun_fact:
      "Samosas originated in Central Asia as 'sambosa' and arrived in India via medieval trade routes. They're mentioned in a 10th-century Persian text by Abolfazl Beyhaqi.",
    how_to_eat:
      "Dip in green mint-coriander chutney or sweet tamarind chutney. Eat while hot. Street vendors crack them open and fill with chickpea curry for 'samosa chaat'.",
  },
  chai: {
    slug: "chai",
    original: "चाय",
    english: "Masala Chai",
    cuisine: "Indian",
    category: "drink",
    description:
      "Black tea brewed with milk, sugar, and warming spices — cardamom, ginger, cinnamon, cloves, and black pepper. India's beloved daily beverage.",
    ingredients: ["black tea", "milk", "sugar", "cardamom", "ginger", "cinnamon", "cloves"],
    allergens: ["milk"],
    fun_fact:
      "India consumes over 837,000 tonnes of tea per year. 'Chai' just means 'tea' — so 'chai tea' literally means 'tea tea'. Chaiwallas (tea sellers) are on every Indian street corner.",
    how_to_eat:
      "Drink it hot from a small glass or clay cup (kulhar). In India, it's sipped throughout the day — with breakfast, after meals, and during work breaks.",
  },

  // === Italian (5) ===
  carbonara: {
    slug: "carbonara",
    original: "Carbonara",
    english: "Pasta alla Carbonara",
    cuisine: "Italian",
    category: "main",
    description:
      "Roman pasta made with guanciale (cured pork cheek), egg yolks, Pecorino Romano cheese, and black pepper. No cream — the silky sauce comes from emulsified eggs and cheese.",
    ingredients: ["spaghetti", "guanciale", "egg yolk", "Pecorino Romano", "black pepper"],
    allergens: ["gluten", "egg", "dairy", "pork"],
    fun_fact:
      "Adding cream to carbonara is considered a cardinal sin in Rome. The dish likely originated post-WWII when American soldiers brought bacon and eggs to Italy.",
    how_to_eat:
      "Twirl pasta around your fork (no spoon needed). Eat immediately — carbonara's sauce thickens as it cools. Add extra pepper to taste.",
  },
  "margherita-pizza": {
    slug: "margherita-pizza",
    original: "Pizza Margherita",
    english: "Margherita Pizza",
    cuisine: "Italian",
    category: "main",
    description:
      "Naples' classic pizza with San Marzano tomato sauce, fresh mozzarella, basil leaves, and olive oil on a thin, charred crust. Simplicity perfected.",
    ingredients: ["pizza dough", "San Marzano tomatoes", "mozzarella", "basil", "olive oil"],
    allergens: ["gluten", "dairy"],
    fun_fact:
      "Legend says it was created in 1889 for Queen Margherita of Italy, with colors representing the Italian flag: red (tomato), white (mozzarella), green (basil).",
    how_to_eat:
      "In Naples, fold it in quarters ('a libretto') and eat with your hands. Use a knife and fork for the soggy center if needed. Don't ask for extra toppings.",
  },
  risotto: {
    slug: "risotto",
    original: "Risotto",
    english: "Risotto",
    cuisine: "Italian",
    category: "rice",
    description:
      "Northern Italian rice dish where Arborio or Carnaroli rice is slowly stirred with broth until creamy. Popular versions include saffron (alla milanese), mushroom, and seafood.",
    ingredients: ["Arborio rice", "broth", "onion", "white wine", "Parmigiano-Reggiano", "butter"],
    allergens: ["dairy", "alcohol", "celery"],
    fun_fact:
      "Risotto alla milanese gets its golden color from saffron, the world's most expensive spice. Legend says a stained-glass artisan accidentally dropped saffron into rice at a wedding feast in 1574.",
    how_to_eat:
      "Eat from the outside in — spread it on the plate so it cools evenly. Risotto should flow like lava (all'onda), not sit in a mound.",
  },
  tiramisu: {
    slug: "tiramisu",
    original: "Tiramisù",
    english: "Tiramisu",
    cuisine: "Italian",
    category: "dessert",
    description:
      "Layers of espresso-soaked ladyfinger biscuits and mascarpone cream dusted with cocoa powder. Italy's most famous dessert — rich, creamy, and coffee-forward.",
    ingredients: ["ladyfingers", "mascarpone", "espresso", "eggs", "sugar", "cocoa powder", "Marsala wine"],
    allergens: ["gluten", "egg", "dairy", "alcohol"],
    fun_fact:
      "Tiramisu means 'pick me up' or 'lift me up' in Italian. It was invented in the 1960s–70s in Treviso, though both Le Beccherie and El Toulà restaurants claim credit.",
    how_to_eat:
      "Eat chilled with a spoon. Let each bite sit on your tongue to taste the layers — espresso, cream, cocoa. Best enjoyed after dinner with an espresso.",
  },
  gelato: {
    slug: "gelato",
    original: "Gelato",
    english: "Gelato",
    cuisine: "Italian",
    category: "dessert",
    description:
      "Italian-style ice cream with less air and fat than American ice cream, resulting in a denser, more intensely flavored frozen treat. Made fresh daily in gelaterie.",
    ingredients: ["milk", "sugar", "egg yolk", "natural flavoring"],
    allergens: ["milk", "dairy", "egg"],
    fun_fact:
      "Gelato has 25–30% air (vs. 50%+ for ice cream), which is why it's denser and more flavorful. The Medici family commissioned the first gelato for a banquet in the 16th century.",
    how_to_eat:
      "At a gelateria, ask to taste before committing. Choose a cup over a cone for delicate flavors. Start with lighter flavors and work toward richer ones.",
  },

  // === Spanish (3) ===
  paella: {
    slug: "paella",
    original: "Paella",
    english: "Paella",
    cuisine: "Spanish",
    category: "rice",
    description:
      "Valencia's iconic rice dish cooked in a wide, shallow pan with saffron, olive oil, and various proteins — seafood, rabbit, chicken, or vegetables — with a prized crispy bottom (socarrat).",
    ingredients: ["rice", "saffron", "olive oil", "seafood", "chicken", "bell pepper", "tomato", "garlic"],
    allergens: ["shellfish", "fish"],
    fun_fact:
      "True Valencian paella traditionally uses rabbit and snails, not seafood. The socarrat — the caramelized rice crust at the bottom — is considered the best part.",
    how_to_eat:
      "Eat directly from the pan with a spoon, each person claiming a wedge-shaped section. Scrape the socarrat from the bottom. Squeeze lemon over seafood versions.",
  },
  gazpacho: {
    slug: "gazpacho",
    original: "Gazpacho",
    english: "Gazpacho",
    cuisine: "Spanish",
    category: "soup",
    description:
      "A chilled Andalusian soup blended from ripe tomatoes, cucumber, bell pepper, garlic, olive oil, and bread. Served ice-cold in summer — refreshing and tangy.",
    ingredients: ["tomato", "cucumber", "bell pepper", "garlic", "olive oil", "bread", "sherry vinegar"],
    allergens: ["gluten"],
    fun_fact:
      "The original gazpacho (before tomatoes arrived from the Americas) was a white bread-and-garlic soup. Tomatoes weren't added until the 19th century.",
    how_to_eat:
      "Serve ice-cold in a bowl or glass. Garnish with diced vegetables, croutons, and a drizzle of olive oil. In Andalusia, it's often drunk from a glass as a snack.",
  },
  churros: {
    slug: "churros",
    original: "Churros",
    english: "Churros",
    cuisine: "Spanish",
    category: "dessert",
    description:
      "Deep-fried dough sticks with a ridged, crispy exterior and soft interior, dusted with cinnamon sugar. Traditionally served with thick hot chocolate for dipping.",
    ingredients: ["flour", "water", "sugar", "cinnamon", "oil", "chocolate"],
    allergens: ["gluten", "dairy"],
    fun_fact:
      "Spanish shepherds invented churros as a portable, easy-to-cook food in the mountains. Eating churros con chocolate at 3 AM after a night out is a Spanish tradition.",
    how_to_eat:
      "Dip each piece into thick hot chocolate (chocolate a la taza). In Spain, the chocolate is so thick it's almost like pudding. Best eaten fresh and warm.",
  },

  // === Mexican (3) ===
  "tacos-al-pastor": {
    slug: "tacos-al-pastor",
    original: "Tacos al Pastor",
    english: "Tacos al Pastor",
    cuisine: "Mexican",
    category: "main",
    description:
      "Thin-sliced pork marinated in chilies and spices, cooked on a vertical spit (trompo) like a kebab, served on small corn tortillas with pineapple, onion, and cilantro.",
    ingredients: ["pork", "corn tortilla", "pineapple", "onion", "cilantro", "guajillo chili", "achiote"],
    allergens: ["pork"],
    fun_fact:
      "Al pastor ('shepherd style') was brought to Mexico by Lebanese immigrants in the early 1900s, who adapted shawarma using local spices and pork instead of lamb.",
    how_to_eat:
      "Hold the taco with one hand, tilt your head, and bite. Squeeze lime and add salsa verde. Use the second tortilla underneath to catch drippings. Eat at the taquería counter.",
  },
  mole: {
    slug: "mole",
    original: "Mole",
    english: "Mole",
    cuisine: "Mexican",
    category: "main",
    description:
      "A complex, deeply flavored sauce made from 20+ ingredients including chilies, chocolate, nuts, seeds, and spices, slow-cooked for hours. Typically served over chicken or turkey.",
    ingredients: ["dried chilies", "chocolate", "sesame seeds", "peanuts", "almonds", "cinnamon", "chicken"],
    allergens: ["peanuts", "tree_nuts", "sesame"],
    fun_fact:
      "Mole poblano from Oaxaca can take 3 days to prepare and uses over 30 ingredients. Mexico has over 200 varieties of mole — it was named a national treasure by the government.",
    how_to_eat:
      "Eat the chicken or turkey with generous amounts of the sauce. Scoop with warm tortillas. Mole is the star — make sure every bite includes it.",
  },
  guacamole: {
    slug: "guacamole",
    original: "Guacamole",
    english: "Guacamole",
    cuisine: "Mexican",
    category: "appetizer",
    description:
      "A creamy dip of mashed ripe avocados mixed with lime juice, cilantro, onion, jalapeño, and tomato. Essential at any Mexican table.",
    ingredients: ["avocado", "lime", "cilantro", "onion", "jalapeño", "tomato", "salt"],
    allergens: [],
    fun_fact:
      "The Aztecs called it 'ahuacamolli' (avocado sauce). Americans consume over 140 million pounds of avocado on Super Bowl Sunday alone — mostly as guacamole.",
    how_to_eat:
      "Scoop with fresh tortilla chips. In Mexico, it's also eaten as a condiment with tacos, grilled meats, and quesadillas. Best eaten within minutes of making — it browns quickly.",
  },

  // === French (3) ===
  croissant: {
    slug: "croissant",
    original: "Croissant",
    english: "Croissant",
    cuisine: "French",
    category: "dessert",
    description:
      "A buttery, flaky crescent-shaped pastry made from laminated dough with dozens of paper-thin layers. The cornerstone of a French breakfast.",
    ingredients: ["flour", "butter", "yeast", "sugar", "milk", "salt"],
    allergens: ["gluten", "dairy", "milk"],
    fun_fact:
      "Despite being France's symbol, the croissant likely originated in Vienna as the 'kipferl'. The crescent shape supposedly celebrates the Austrian victory over the Ottoman siege of 1683.",
    how_to_eat:
      "Tear apart with your hands — never cut with a knife. Dip into café au lait. A plain croissant (not filled) means the butter quality is superb. Expect flaky crumbs everywhere.",
  },
  bouillabaisse: {
    slug: "bouillabaisse",
    original: "Bouillabaisse",
    english: "Bouillabaisse",
    cuisine: "French",
    category: "soup",
    description:
      "A rich, saffron-scented seafood stew from Marseille made with at least three kinds of fish, shellfish, tomatoes, fennel, and herbs, served with rouille (garlic-saffron mayo) on toast.",
    ingredients: ["mixed fish", "shrimp", "mussels", "saffron", "tomato", "fennel", "garlic", "olive oil"],
    allergens: ["fish", "shellfish", "gluten", "egg"],
    fun_fact:
      "Bouillabaisse was originally a humble fisherman's stew made from the unsold catch. Marseille's Bouillabaisse Charter (1980) legally defines what qualifies as authentic bouillabaisse.",
    how_to_eat:
      "Spread rouille on toasted bread, float it in the broth, and eat. The fish is traditionally served separately. Eat the broth as soup, then the fish as a second course.",
  },
  "creme-brulee": {
    slug: "creme-brulee",
    original: "Crème brûlée",
    english: "Crème Brûlée",
    cuisine: "French",
    category: "dessert",
    description:
      "A silky vanilla custard topped with a thin layer of caramelized sugar that cracks satisfyingly when tapped with a spoon. France's quintessential dessert.",
    ingredients: ["cream", "egg yolk", "sugar", "vanilla"],
    allergens: ["dairy", "egg", "milk"],
    fun_fact:
      "Both France and England claim to have invented crème brûlée. The earliest known recipe appeared in a 1691 French cookbook by François Massialot. The sugar is caramelized to order with a torch.",
    how_to_eat:
      "Tap the caramelized top firmly with the back of your spoon to crack it. Scoop through both crunchy sugar and creamy custard in each bite for the perfect contrast.",
  },

  // === Greek (2) ===
  moussaka: {
    slug: "moussaka",
    original: "Μουσακάς",
    english: "Moussaka",
    cuisine: "Greek",
    category: "main",
    description:
      "A layered casserole of sliced eggplant, spiced ground lamb, and creamy béchamel sauce, baked until golden and bubbly. Greece's most famous comfort food.",
    ingredients: ["eggplant", "ground lamb", "tomato", "onion", "béchamel sauce", "cinnamon", "nutmeg"],
    allergens: ["dairy", "gluten", "milk"],
    fun_fact:
      "The modern version with béchamel was codified in the 1920s by Nikolaos Tselementes, a French-trained Greek chef who modernized Greek cuisine. The dish has Arab roots from the 13th century.",
    how_to_eat:
      "Serve in squares like lasagna. Let it rest 15 minutes after baking so the layers hold together. Eat with a fork and crusty bread to soak up the sauce.",
  },
  souvlaki: {
    slug: "souvlaki",
    original: "Σουβλάκι",
    english: "Souvlaki",
    cuisine: "Greek",
    category: "main",
    description:
      "Small pieces of marinated pork, chicken, or lamb grilled on skewers, served in pita bread with tzatziki, tomato, onion, and fries. Greece's favorite street food.",
    ingredients: ["pork", "pita bread", "tzatziki", "tomato", "onion", "fries", "olive oil", "oregano"],
    allergens: ["gluten", "dairy"],
    fun_fact:
      "Ancient Greeks ate a similar dish called 'obeliskos' (from which 'obelisk' derives) — meat cooked on spits. Souvlaki shops in Athens stay open until dawn to feed late-night crowds.",
    how_to_eat:
      "Eat the pita wrap with your hands like a burrito. Fries go inside the wrap, not on the side. Add extra tzatziki and hot sauce. Napkins are essential.",
  },

  // === Turkish (2) ===
  kebab: {
    slug: "kebab",
    original: "Kebap",
    english: "Kebab",
    cuisine: "Turkish",
    category: "main",
    description:
      "Seasoned ground lamb or beef formed around a flat skewer and grilled over charcoal (Adana kebab), or marinated meat chunks grilled on skewers (shish kebab). Served with flatbread, grilled vegetables, and yogurt.",
    ingredients: ["lamb", "beef", "onion", "red pepper flakes", "flatbread", "sumac", "parsley", "yogurt"],
    allergens: ["gluten", "dairy"],
    fun_fact:
      "Turkish soldiers in the Ottoman Empire supposedly invented kebabs by grilling meat on their swords over open field fires. Turkey has over 300 regional kebab varieties.",
    how_to_eat:
      "Wrap meat in lavash flatbread with grilled peppers and onion. Sprinkle sumac (tart red spice) over the onions. Alternate bites with yogurt and grilled tomato.",
  },
  baklava: {
    slug: "baklava",
    original: "Baklava",
    english: "Baklava",
    cuisine: "Turkish",
    category: "dessert",
    description:
      "Layers of paper-thin phyllo dough filled with chopped pistachios or walnuts, soaked in honey or sugar syrup flavored with rosewater or lemon. Rich, sweet, and crunchy.",
    ingredients: ["phyllo dough", "pistachios", "butter", "sugar syrup", "honey", "lemon"],
    allergens: ["gluten", "tree_nuts", "dairy"],
    fun_fact:
      "Gaziantep, Turkey is the baklava capital of the world. A single tray can have 40+ layers of phyllo, each stretched so thin you can read a newspaper through it.",
    how_to_eat:
      "Eat small pieces — it's incredibly sweet and rich. Pick up with fingers or a small fork. Pair with strong Turkish tea or black coffee to cut the sweetness.",
  },

  // === Korean (2) ===
  "kimchi-jjigae": {
    slug: "kimchi-jjigae",
    original: "김치찌개",
    english: "Kimchi Stew",
    cuisine: "Korean",
    category: "soup",
    description:
      "A hearty, bubbling stew made with aged kimchi, pork belly, tofu, and green onions. The older and more fermented the kimchi, the deeper the flavor. Korea's ultimate comfort food.",
    ingredients: ["aged kimchi", "pork belly", "tofu", "green onion", "gochugaru", "garlic", "sesame oil"],
    allergens: ["soy", "sesame", "pork", "fish"],
    fun_fact:
      "Koreans intentionally let kimchi over-ferment (shin kimchi) specifically to make this stew. It's considered the best hangover cure in Korea, and most Koreans eat it weekly.",
    how_to_eat:
      "It arrives boiling hot in a stone pot — let it cool slightly. Eat with steamed rice and side dishes (banchan). Spoon stew over rice or alternate bites.",
  },
  tteokbokki: {
    slug: "tteokbokki",
    original: "떡볶이",
    english: "Tteokbokki",
    cuisine: "Korean",
    category: "appetizer",
    description:
      "Chewy cylindrical rice cakes simmered in a sweet, spicy gochujang-based sauce with fish cakes and green onions. Korea's most beloved street food snack.",
    ingredients: ["rice cakes", "gochujang", "gochugaru", "fish cakes", "sugar", "green onion", "soy sauce"],
    allergens: ["soy", "fish", "gluten"],
    fun_fact:
      "Tteokbokki was originally a royal court dish stir-fried in soy sauce (gungjung tteokbokki). The spicy red version was invented in the 1950s and quickly became Korea's #1 street food.",
    how_to_eat:
      "Eat with chopsticks or a skewer at street stalls. Blow on it — the sauce stays scalding hot. Pair with fried dumplings (twigim) and a cup of fish cake broth.",
  },

  // === Southeast Asian (2) ===
  satay: {
    slug: "satay",
    original: "Satai",
    english: "Satay",
    cuisine: "Southeast Asian",
    category: "appetizer",
    description:
      "Marinated and grilled meat skewers (chicken, beef, or pork) served with a rich, sweet peanut dipping sauce, cucumber slices, and compressed rice cakes (ketupat).",
    ingredients: ["chicken", "turmeric", "lemongrass", "peanut sauce", "cucumber", "rice cakes", "shallots"],
    allergens: ["peanuts", "soy"],
    fun_fact:
      "Satay was inspired by Indian kebabs brought by Arab and Indian traders to Southeast Asia. It's claimed by Indonesia, Malaysia, Thailand, and Singapore — each with distinct versions.",
    how_to_eat:
      "Slide the meat off the skewer with your teeth or a fork. Dip generously in peanut sauce. Eat with cubes of compressed rice and fresh cucumber slices between bites.",
  },
  "mango-sticky-rice": {
    slug: "mango-sticky-rice",
    original: "ข้าวเหนียวมะม่วง",
    english: "Mango Sticky Rice",
    cuisine: "Thai",
    category: "dessert",
    description:
      "Sweet glutinous rice soaked in warm coconut cream, served with ripe mango slices and topped with a drizzle of coconut sauce and crunchy mung beans. Thailand's signature dessert.",
    ingredients: ["sticky rice", "coconut milk", "sugar", "mango", "mung beans", "salt"],
    allergens: [],
    fun_fact:
      "This dessert is seasonal — it's best from April to June when Thai Nam Dok Mai mangoes are at peak sweetness. Street vendors sell over 10,000 portions daily during mango season in Bangkok.",
    how_to_eat:
      "Scoop rice and mango together in each bite with a spoon. The warm coconut rice with cold, sweet mango is the perfect contrast. Eat it fresh — the rice hardens as it cools.",
  },
};
