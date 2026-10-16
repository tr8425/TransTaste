/** Allergen & dietary labels in 9 languages (MVP hardcoded) */
// Destination languages shown on the staff-facing allergy/order card:
// ja, zh, th, vi, es, fr, it, en (the 8 phrasebook locales) + ko.

export const ALLERGEN_LABELS: Record<string, Record<string, string>> = {
  // 14 EU allergens
  shellfish: {
    ja: "エビ・カニアレルギー",
    zh: "甲壳类过敏",
    th: "แพ้อาหารทะเล",
    vi: "Dị ứng tôm cua",
    es: "Alergia al marisco",
    fr: "Allergie aux crustacés",
    it: "Allergia ai crostacei",
    en: "Shellfish allergy",
    ko: "갑각류 알레르기",
  },
  peanuts: {
    ja: "ピーナッツアレルギー",
    zh: "花生过敏",
    th: "แพ้ถั่วลิสง",
    vi: "Dị ứng đậu phộng",
    es: "Alergia al cacahuete",
    fr: "Allergie aux arachides",
    it: "Allergia alle arachidi",
    en: "Peanut allergy",
    ko: "땅콩 알레르기",
  },
  tree_nuts: {
    ja: "ナッツアレルギー",
    zh: "坚果过敏",
    th: "แพ้ถั่วเปลือกแข็ง",
    vi: "Dị ứng hạt cây",
    es: "Alergia a los frutos secos",
    fr: "Allergie aux fruits à coque",
    it: "Allergia alla frutta a guscio",
    en: "Tree nut allergy",
    ko: "견과류 알레르기",
  },
  milk: {
    ja: "乳製品アレルギー",
    zh: "牛奶过敏",
    th: "แพ้นม",
    vi: "Dị ứng sữa",
    es: "Alergia a la leche",
    fr: "Allergie au lait",
    it: "Allergia al latte",
    en: "Milk/dairy allergy",
    ko: "유제품 알레르기",
  },
  eggs: {
    ja: "卵アレルギー",
    zh: "鸡蛋过敏",
    th: "แพ้ไข่",
    vi: "Dị ứng trứng",
    es: "Alergia al huevo",
    fr: "Allergie aux œufs",
    it: "Allergia alle uova",
    en: "Egg allergy",
    ko: "계란 알레르기",
  },
  gluten: {
    ja: "グルテンアレルギー",
    zh: "麸质过敏",
    th: "แพ้กลูเตน",
    vi: "Dị ứng gluten",
    es: "Alergia al gluten",
    fr: "Allergie au gluten",
    it: "Allergia al glutine",
    en: "Gluten allergy",
    ko: "글루텐 알레르기",
  },
  fish: {
    ja: "魚アレルギー",
    zh: "鱼类过敏",
    th: "แพ้ปลา",
    vi: "Dị ứng cá",
    es: "Alergia al pescado",
    fr: "Allergie au poisson",
    it: "Allergia al pesce",
    en: "Fish allergy",
    ko: "생선 알레르기",
  },
  soy: {
    ja: "大豆アレルギー",
    zh: "大豆过敏",
    th: "แพ้ถั่วเหลือง",
    vi: "Dị ứng đậu nành",
    es: "Alergia a la soja",
    fr: "Allergie au soja",
    it: "Allergia alla soia",
    en: "Soy allergy",
    ko: "대두 알레르기",
  },
  sesame: {
    ja: "ごまアレルギー",
    zh: "芝麻过敏",
    th: "แพ้งา",
    vi: "Dị ứng mè",
    es: "Alergia al sésamo",
    fr: "Allergie au sésame",
    it: "Allergia al sesamo",
    en: "Sesame allergy",
    ko: "참깨 알레르기",
  },
  celery: {
    ja: "セロリアレルギー",
    zh: "芹菜过敏",
    th: "แพ้ขึ้นฉ่าย",
    vi: "Dị ứng cần tây",
    es: "Alergia al apio",
    fr: "Allergie au céleri",
    it: "Allergia al sedano",
    en: "Celery allergy",
    ko: "셀러리 알레르기",
  },
  mustard: {
    ja: "マスタードアレルギー",
    zh: "芥末过敏",
    th: "แพ้มัสตาร์ด",
    vi: "Dị ứng mù tạt",
    es: "Alergia a la mostaza",
    fr: "Allergie à la moutarde",
    it: "Allergia alla senape",
    en: "Mustard allergy",
    ko: "겨자 알레르기",
  },
  lupin: {
    ja: "ルピナスアレルギー",
    zh: "羽扇豆过敏",
    th: "แพ้ลูปิน",
    vi: "Dị ứng lupin",
    es: "Alergia al altramuz",
    fr: "Allergie au lupin",
    it: "Allergia ai lupini",
    en: "Lupin allergy",
    ko: "루핀 알레르기",
  },
  molluscs: {
    ja: "軟体動物アレルギー",
    zh: "软体动物过敏",
    th: "แพ้หอย",
    vi: "Dị ứng động vật thân mềm",
    es: "Alergia a los moluscos",
    fr: "Allergie aux mollusques",
    it: "Allergia ai molluschi",
    en: "Mollusc allergy",
    ko: "연체류 알레르기",
  },
  sulphites: {
    ja: "亜硫酸塩アレルギー",
    zh: "亚硫酸盐过敏",
    th: "แพ้ซัลไฟต์",
    vi: "Dị ứng sulphite",
    es: "Alergia a los sulfitos",
    fr: "Allergie aux sulfites",
    it: "Allergia ai solfiti",
    en: "Sulphite allergy",
    ko: "아황산염 알레르기",
  },
  // Dietary beliefs
  vegan: {
    ja: "ヴィーガン",
    zh: "纯素食",
    th: "วีแกน",
    vi: "Thuần chay",
    es: "Vegano",
    fr: "Végétalien",
    it: "Vegano",
    en: "Vegan",
    ko: "비건",
  },
  vegetarian: {
    ja: "ベジタリアン",
    zh: "素食",
    th: "มังสวิรัติ",
    vi: "Ăn chay",
    es: "Vegetariano",
    fr: "Végétarien",
    it: "Vegetariano",
    en: "Vegetarian",
    ko: "채식",
  },
  halal: {
    ja: "ハラール",
    zh: "清真",
    th: "ฮาลาล",
    vi: "Halal",
    es: "Halal",
    fr: "Halal",
    it: "Halal",
    en: "Halal",
    ko: "할랄",
  },
  kosher: {
    ja: "コーシャ",
    zh: "犹太洁食",
    th: "โคเชอร์",
    vi: "Kosher",
    es: "Kosher",
    fr: "Casher",
    it: "Kosher",
    en: "Kosher",
    ko: "코셔",
  },
};

/** Ingredient names for phrase templates (not allergy labels) */
export const ALLERGEN_INGREDIENT_NAMES: Record<string, Record<string, string>> = {
  shellfish: { ja: "エビ・カニ", zh: "虾蟹", th: "กุ้ง ปู", vi: "tôm cua", es: "marisco", fr: "crustacés", it: "crostacei", en: "shellfish", ko: "새우/게" },
  peanuts: { ja: "ピーナッツ", zh: "花生", th: "ถั่วลิสง", vi: "đậu phộng", es: "cacahuetes", fr: "arachides", it: "arachidi", en: "peanuts", ko: "땅콩" },
  tree_nuts: { ja: "ナッツ", zh: "坚果", th: "ถั่วเปลือกแข็ง", vi: "hạt cây", es: "frutos secos", fr: "fruits à coque", it: "frutta a guscio", en: "nuts", ko: "견과류" },
  milk: { ja: "乳製品", zh: "牛奶", th: "นม", vi: "sữa", es: "lácteos", fr: "produits laitiers", it: "latticini", en: "dairy", ko: "유제품" },
  eggs: { ja: "卵", zh: "鸡蛋", th: "ไข่", vi: "trứng", es: "huevo", fr: "œufs", it: "uova", en: "eggs", ko: "계란" },
  egg: { ja: "卵", zh: "鸡蛋", th: "ไข่", vi: "trứng", es: "huevo", fr: "œufs", it: "uova", en: "eggs", ko: "계란" },
  gluten: { ja: "小麦", zh: "面粉", th: "แป้งสาลี", vi: "gluten", es: "trigo/gluten", fr: "blé/gluten", it: "grano/glutine", en: "wheat/gluten", ko: "밀가루" },
  fish: { ja: "魚", zh: "鱼", th: "ปลา", vi: "cá", es: "pescado", fr: "poisson", it: "pesce", en: "fish", ko: "생선" },
  soy: { ja: "大豆", zh: "大豆", th: "ถั่วเหลือง", vi: "đậu nành", es: "soja", fr: "soja", it: "soia", en: "soy", ko: "대두" },
  sesame: { ja: "ゴマ", zh: "芝麻", th: "งา", vi: "mè", es: "sésamo", fr: "sésame", it: "sesamo", en: "sesame", ko: "참깨" },
  celery: { ja: "セロリ", zh: "芹菜", th: "ขึ้นฉ่าย", vi: "cần tây", es: "apio", fr: "céleri", it: "sedano", en: "celery", ko: "셀러리" },
  mustard: { ja: "からし", zh: "芥末", th: "มัสตาร์ด", vi: "mù tạt", es: "mostaza", fr: "moutarde", it: "senape", en: "mustard", ko: "겨자" },
  sulfites: { ja: "亜硫酸塩", zh: "亚硫酸盐", th: "ซัลไฟต์", vi: "sulfit", es: "sulfitos", fr: "sulfites", it: "solfiti", en: "sulfites", ko: "아황산염" },
  dairy: { ja: "乳製品", zh: "牛奶", th: "นม", vi: "sữa", es: "lácteos", fr: "produits laitiers", it: "latticini", en: "dairy", ko: "유제품" },
  pork: { ja: "豚肉", zh: "猪肉", th: "หมู", vi: "thịt heo", es: "cerdo", fr: "porc", it: "maiale", en: "pork", ko: "돼지고기" },
  beef: { ja: "牛肉", zh: "牛肉", th: "เนื้อวัว", vi: "thịt bò", es: "ternera", fr: "bœuf", it: "manzo", en: "beef", ko: "소고기" },
  alcohol: { ja: "お酒", zh: "酒", th: "แอลกอฮอล์", vi: "rượu", es: "alcohol", fr: "alcool", it: "alcol", en: "alcohol", ko: "술" },
  // Preset ids from onboarding/profile that differ from the AI tag names
  wheat_gluten: { ja: "小麦", zh: "面粉", th: "แป้งสาลี", vi: "gluten", es: "trigo/gluten", fr: "blé/gluten", it: "grano/glutine", en: "wheat/gluten", ko: "밀가루" },
  sulphites: { ja: "亜硫酸塩", zh: "亚硫酸盐", th: "ซัลไฟต์", vi: "sulfit", es: "sulfitos", fr: "sulfites", it: "solfiti", en: "sulphites", ko: "아황산염" },
  molluscs: { ja: "貝類・イカ・タコ", zh: "贝类", th: "หอย ปลาหมึก", vi: "nhuyễn thể", es: "moluscos", fr: "mollusques", it: "molluschi", en: "molluscs", ko: "연체류" },
  lupin: { ja: "ルピナス", zh: "羽扇豆", th: "ลูพิน", vi: "đậu lupin", es: "altramuces", fr: "lupin", it: "lupini", en: "lupin", ko: "루핀" },
};

/**
 * Romanized ingredient names for the pronunciation line of phrase templates.
 * Only non-Latin-script languages need an entry; Latin-script languages reuse
 * ALLERGEN_INGREDIENT_NAMES as-is.
 */
export const ALLERGEN_INGREDIENT_ROMANIZED: Record<string, Partial<Record<"ja" | "zh" | "th", string>>> = {
  shellfish: { ja: "ebi kani", zh: "xiā xiè", th: "kung pu" },
  peanuts: { ja: "pīnattsu", zh: "huāshēng", th: "thua lisong" },
  tree_nuts: { ja: "nattsu", zh: "jiānguǒ", th: "thua plueak khaeng" },
  milk: { ja: "nyūseihin", zh: "niúnǎi", th: "nom" },
  dairy: { ja: "nyūseihin", zh: "niúnǎi", th: "nom" },
  eggs: { ja: "tamago", zh: "jīdàn", th: "khai" },
  egg: { ja: "tamago", zh: "jīdàn", th: "khai" },
  gluten: { ja: "komugi", zh: "miànfěn", th: "paeng sali" },
  wheat_gluten: { ja: "komugi", zh: "miànfěn", th: "paeng sali" },
  fish: { ja: "sakana", zh: "yú", th: "pla" },
  soy: { ja: "daizu", zh: "dàdòu", th: "thua lueang" },
  sesame: { ja: "goma", zh: "zhīma", th: "nga" },
  celery: { ja: "serori", zh: "qíncài", th: "khuen chai" },
  mustard: { ja: "karashi", zh: "jièmo", th: "mustat" },
  sulfites: { ja: "aryūsan'en", zh: "yàliúsuānyán", th: "sanfai" },
  sulphites: { ja: "aryūsan'en", zh: "yàliúsuānyán", th: "sanfai" },
  molluscs: { ja: "kairui ika tako", zh: "bèilèi", th: "hoi pla muek" },
  lupin: { ja: "rupinasu", zh: "yǔshàndòu", th: "lupin" },
  pork: { ja: "butaniku", zh: "zhūròu", th: "mu" },
  beef: { ja: "gyūniku", zh: "niúròu", th: "nuea wua" },
  alcohol: { ja: "osake", zh: "jiǔ", th: "aelkohol" },
};

/** Ingredient name to splice into a pronunciation line for `lang`. */
export function ingredientPronunciation(allergen: string, lang: string): string {
  const romanized = ALLERGEN_INGREDIENT_ROMANIZED[allergen]?.[lang as "ja" | "zh" | "th"];
  if (romanized) return romanized;
  const names = ALLERGEN_INGREDIENT_NAMES[allergen];
  // Non-Latin scripts without a romanization fall back to English, never to native script.
  if (lang === "ja" || lang === "zh" || lang === "th") return names?.en || allergen;
  return names?.[lang] || names?.en || allergen;
}

/**
 * Canonical allergen groups used to match the user's preset ids
 * (onboarding/profile: "milk", "eggs", "wheat_gluten", "tree_nuts", ...)
 * against the AI's dish tags ("dairy", "egg", "gluten", "nuts", ...).
 * A token can belong to several groups when the tag is broader than the
 * preset (e.g. "nuts" covers peanuts and tree nuts).
 */
const ALLERGEN_GROUPS: Record<string, string[]> = {
  shellfish: ["shellfish", "molluscs"],
  crustacean: ["shellfish"],
  crustaceans: ["shellfish"],
  shrimp: ["shellfish"],
  molluscs: ["molluscs"],
  mollusks: ["molluscs"],
  mollusc: ["molluscs"],
  mollusk: ["molluscs"],
  peanuts: ["peanuts"],
  peanut: ["peanuts"],
  tree_nuts: ["tree_nuts"],
  tree_nut: ["tree_nuts"],
  nuts: ["peanuts", "tree_nuts"],
  nut: ["peanuts", "tree_nuts"],
  milk: ["milk"],
  dairy: ["milk"],
  lactose: ["milk"],
  eggs: ["eggs"],
  egg: ["eggs"],
  fish: ["fish"],
  soy: ["soy"],
  soya: ["soy"],
  soybean: ["soy"],
  soybeans: ["soy"],
  wheat_gluten: ["wheat_gluten"],
  wheat: ["wheat_gluten"],
  gluten: ["wheat_gluten"],
  sesame: ["sesame"],
  celery: ["celery"],
  mustard: ["mustard"],
  lupin: ["lupin"],
  lupine: ["lupin"],
  sulphites: ["sulphites"],
  sulfites: ["sulphites"],
  sulphite: ["sulphites"],
  sulfite: ["sulphites"],
};

function allergenGroups(token: string): string[] {
  const key = token.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ALLERGEN_GROUPS[key] ?? [key];
}

/**
 * Returns the dish allergen tags that match the user's allergen preset,
 * after synonym normalisation (dairy~milk, soy~soybean, nuts~peanuts, ...).
 */
export function matchUserAllergens(dishAllergens: string[] | undefined, preset: string[]): string[] {
  if (!dishAllergens?.length || !preset.length) return [];
  const wanted = new Set(preset.flatMap(allergenGroups));
  return dishAllergens.filter((tag) => allergenGroups(tag).some((group) => wanted.has(group)));
}

export const CONFIRM_LABELS: Record<string, string> = {
  ja: "確認しました",
  zh: "已确认",
  th: "ยืนยันแล้ว",
  vi: "Đã xác nhận",
  es: "Confirmado",
  fr: "Confirmé",
  it: "Confermato",
  en: "Confirmed",
  ko: "확인했어요",
};

export const ORDER_HEADERS: Record<string, string> = {
  ja: "ご注文",
  zh: "您的订单",
  th: "รายการสั่ง",
  vi: "Đơn hàng",
  es: "Su pedido",
  fr: "Votre commande",
  it: "Il suo ordine",
  en: "Your Order",
  ko: "주문 목록",
};

export const DIETARY_LABELS: Record<string, Record<string, string>> = {
  vegetarian: {
    ja: "ベジタリアン", zh: "素食", th: "มังสวิรัติ", vi: "Ăn chay", es: "Vegetariano", fr: "Végétarien", it: "Vegetariano", en: "Vegetarian", ko: "채식",
  },
  vegan: {
    ja: "ヴィーガン", zh: "纯素", th: "วีแกน", vi: "Thuần chay", es: "Vegano", fr: "Végétalien", it: "Vegano", en: "Vegan", ko: "비건",
  },
  halal: {
    ja: "ハラール", zh: "清真", th: "ฮาลาล", vi: "Halal", es: "Halal", fr: "Halal", it: "Halal", en: "Halal", ko: "할랄",
  },
  kosher: {
    ja: "コーシャ", zh: "犹太洁食", th: "โคเชอร์", vi: "Kosher", es: "Kosher", fr: "Casher", it: "Kosher", en: "Kosher", ko: "코셔",
  },
  pescatarian: {
    ja: "ペスカタリアン", zh: "鱼素", th: "เพสคาทาเรียน", vi: "Pescatarian", es: "Pescetariano", fr: "Pescétarien", it: "Pescetariano", en: "Pescatarian", ko: "페스코",
  },
  no_beef: {
    ja: "牛肉不可", zh: "不吃牛肉", th: "ไม่ทานเนื้อวัว", vi: "Không ăn bò", es: "Sin ternera", fr: "Sans bœuf", it: "Senza manzo", en: "No beef", ko: "소고기 금지",
  },
  no_pork: {
    ja: "豚肉不可", zh: "不吃猪肉", th: "ไม่ทานหมู", vi: "Không ăn heo", es: "Sin cerdo", fr: "Sans porc", it: "Senza maiale", en: "No pork", ko: "돼지고기 금지",
  },
};

export const DIETARY_HEADERS: Record<string, string> = {
  ja: "食事制限があります",
  zh: "有饮食限制",
  th: "มีข้อจำกัดด้านอาหาร",
  vi: "Có hạn chế ăn uống",
  es: "Tengo restricciones alimentarias",
  fr: "J'ai des restrictions alimentaires",
  it: "Ho restrizioni alimentari",
  en: "Has dietary restrictions",
  ko: "식이 제한이 있어요",
};

export const ALLERGY_HEADERS: Record<string, string> = {
  ja: "アレルギーがあります",
  zh: "有过敏症",
  th: "มีอาการแพ้",
  vi: "Có dị ứng",
  es: "Tengo alergias",
  fr: "J'ai des allergies",
  it: "Ho delle allergie",
  en: "Has allergies",
  ko: "알레르기가 있어요",
};

export const TOTAL_LABELS: Record<string, string> = {
  ja: "合計",
  zh: "合计",
  th: "รวม",
  vi: "Tổng cộng",
  es: "Total",
  fr: "Total",
  it: "Totale",
  en: "Total",
  ko: "합계",
};

/**
 * Supported destination locales for the staff-facing allergy/order card.
 * Anything else falls back to English.
 */
export const CARD_LOCALES = ["ja", "zh", "th", "vi", "es", "fr", "it", "en", "ko"] as const;

// Maps both ISO codes ("ja", "zh-CN") and English/native language names
// ("Japanese", "中文", "Español") onto a CARD_LOCALES code.
const LANG_ALIASES: Record<string, string> = {
  ja: "ja", japanese: "ja", "日本語": "ja", nihongo: "ja",
  zh: "zh", chinese: "zh", mandarin: "zh", cantonese: "zh",
  "中文": "zh", "汉语": "zh", "漢語": "zh", "普通话": "zh",
  th: "th", thai: "th", "ไทย": "th",
  vi: "vi", vietnamese: "vi", "tiếng việt": "vi", "tieng viet": "vi",
  es: "es", spanish: "es", "español": "es", espanol: "es", castellano: "es", castilian: "es",
  fr: "fr", french: "fr", "français": "fr", francais: "fr",
  it: "it", italian: "it", italiano: "it",
  ko: "ko", korean: "ko", "한국어": "ko", hangul: "ko", hangugeo: "ko",
  en: "en", english: "en",
};

/**
 * Normalize a detected menu language to one of {@link CARD_LOCALES}.
 * Accepts ISO codes, region-tagged codes, and English/native names.
 * Replaces the fragile `menuLanguage.slice(0, 2)` heuristic that
 * mis-mapped "Chinese" → "ch" and "Spanish" → "sp" (both fell back to English).
 */
export function normalizeMenuLang(menuLanguage: string | undefined | null): string {
  if (!menuLanguage) return "en";
  const raw = menuLanguage.trim().toLowerCase();
  if (!raw) return "en";
  // 1) Exact alias match (covers ISO codes and full names/native names)
  if (LANG_ALIASES[raw]) return LANG_ALIASES[raw];
  // 2) Leading ISO code, e.g. "zh-cn", "en-us" — only if it is itself a canonical code
  const code2 = raw.slice(0, 2);
  if (LANG_ALIASES[code2] === code2) return code2;
  // 3) Prefix match for decorated names, e.g. "japanese (kanji)", "italiano - menu"
  for (const key of Object.keys(LANG_ALIASES)) {
    if (key.length > 2 && raw.startsWith(key)) return LANG_ALIASES[key];
  }
  return "en";
}

/**
 * Simple tip culture by country code.
 * `noteKey` resolves to `tipCulture.tipNote.<key>` in i18n JSON.
 */
export const TIP_CULTURE: Record<string, { percent: number; noteKey: string }> = {
  JP: { percent: 0, noteKey: "noTipJP" },
  KR: { percent: 0, noteKey: "noTipKR" },
  CN: { percent: 0, noteKey: "noTipCN" },
  HK: { percent: 0, noteKey: "serviceChargeHK" },
  TW: { percent: 0, noteKey: "noTipTW" },
  TH: { percent: 0, noteKey: "noTipTH" },
  VN: { percent: 0, noteKey: "noTipVN" },
  US: { percent: 18, noteKey: "tip18" },
  CA: { percent: 15, noteKey: "tip15" },
  GB: { percent: 10, noteKey: "tip10" },
  FR: { percent: 0, noteKey: "serviceIncludedFR" },
  IT: { percent: 0, noteKey: "copertoIT" },
  DE: { percent: 10, noteKey: "tip10" },
  ES: { percent: 0, noteKey: "noTipES" },
  AU: { percent: 0, noteKey: "noTipAU" },
  MX: { percent: 15, noteKey: "tip15" },
};

// The analysis returns country names ("Japan", "Hong Kong"), while TIP_CULTURE is
// keyed by ISO code. Accept either, plus the menu currency as a fallback hint.
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  japan: "JP", "south korea": "KR", korea: "KR", "republic of korea": "KR",
  china: "CN", "mainland china": "CN", "hong kong": "HK", "hong kong sar": "HK",
  taiwan: "TW", thailand: "TH", vietnam: "VN", "viet nam": "VN",
  "united states": "US", usa: "US", "united states of america": "US",
  canada: "CA", "united kingdom": "GB", uk: "GB", england: "GB",
  france: "FR", italy: "IT", germany: "DE", spain: "ES", australia: "AU", mexico: "MX",
};
const CURRENCY_TO_CODE: Record<string, string> = {
  HKD: "HK", TWD: "TW", JPY: "JP", KRW: "KR", THB: "TH", VND: "VN", CNY: "CN", MXN: "MX", AUD: "AU", CAD: "CA", GBP: "GB",
};

export function resolveTipCulture(
  country: string | undefined | null,
  currency?: string | null,
): { percent: number; noteKey: string } | null {
  const raw = (country || "").trim();
  const code = raw.length === 2 ? raw.toUpperCase() : COUNTRY_NAME_TO_CODE[raw.toLowerCase()];
  if (code && TIP_CULTURE[code]) return TIP_CULTURE[code];
  const fromCurrency = currency ? CURRENCY_TO_CODE[currency.toUpperCase()] : undefined;
  return fromCurrency ? TIP_CULTURE[fromCurrency] ?? null : null;
}
