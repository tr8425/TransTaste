/** Allergen & dietary labels in 6 languages (MVP hardcoded) */

export const ALLERGEN_LABELS: Record<string, Record<string, string>> = {
  // 14 EU allergens
  shellfish: {
    ja: "エビ・カニアレルギー",
    zh: "甲壳类过敏",
    th: "แพ้อาหารทะเล",
    vi: "Dị ứng tôm cua",
    en: "Shellfish allergy",
    ko: "갑각류 알레르기",
  },
  peanuts: {
    ja: "ピーナッツアレルギー",
    zh: "花生过敏",
    th: "แพ้ถั่วลิสง",
    vi: "Dị ứng đậu phộng",
    en: "Peanut allergy",
    ko: "땅콩 알레르기",
  },
  tree_nuts: {
    ja: "ナッツアレルギー",
    zh: "坚果过敏",
    th: "แพ้ถั่วเปลือกแข็ง",
    vi: "Dị ứng hạt cây",
    en: "Tree nut allergy",
    ko: "견과류 알레르기",
  },
  milk: {
    ja: "乳製品アレルギー",
    zh: "牛奶过敏",
    th: "แพ้นม",
    vi: "Dị ứng sữa",
    en: "Milk/dairy allergy",
    ko: "유제품 알레르기",
  },
  eggs: {
    ja: "卵アレルギー",
    zh: "鸡蛋过敏",
    th: "แพ้ไข่",
    vi: "Dị ứng trứng",
    en: "Egg allergy",
    ko: "계란 알레르기",
  },
  gluten: {
    ja: "グルテンアレルギー",
    zh: "麸质过敏",
    th: "แพ้กลูเตน",
    vi: "Dị ứng gluten",
    en: "Gluten allergy",
    ko: "글루텐 알레르기",
  },
  fish: {
    ja: "魚アレルギー",
    zh: "鱼类过敏",
    th: "แพ้ปลา",
    vi: "Dị ứng cá",
    en: "Fish allergy",
    ko: "생선 알레르기",
  },
  soy: {
    ja: "大豆アレルギー",
    zh: "大豆过敏",
    th: "แพ้ถั่วเหลือง",
    vi: "Dị ứng đậu nành",
    en: "Soy allergy",
    ko: "대두 알레르기",
  },
  sesame: {
    ja: "ごまアレルギー",
    zh: "芝麻过敏",
    th: "แพ้งา",
    vi: "Dị ứng mè",
    en: "Sesame allergy",
    ko: "참깨 알레르기",
  },
  celery: {
    ja: "セロリアレルギー",
    zh: "芹菜过敏",
    th: "แพ้ขึ้นฉ่าย",
    vi: "Dị ứng cần tây",
    en: "Celery allergy",
    ko: "셀러리 알레르기",
  },
  mustard: {
    ja: "マスタードアレルギー",
    zh: "芥末过敏",
    th: "แพ้มัสตาร์ด",
    vi: "Dị ứng mù tạt",
    en: "Mustard allergy",
    ko: "겨자 알레르기",
  },
  lupin: {
    ja: "ルピナスアレルギー",
    zh: "羽扇豆过敏",
    th: "แพ้ลูปิน",
    vi: "Dị ứng lupin",
    en: "Lupin allergy",
    ko: "루핀 알레르기",
  },
  molluscs: {
    ja: "軟体動物アレルギー",
    zh: "软体动物过敏",
    th: "แพ้หอย",
    vi: "Dị ứng động vật thân mềm",
    en: "Mollusc allergy",
    ko: "연체류 알레르기",
  },
  sulphites: {
    ja: "亜硫酸塩アレルギー",
    zh: "亚硫酸盐过敏",
    th: "แพ้ซัลไฟต์",
    vi: "Dị ứng sulphite",
    en: "Sulphite allergy",
    ko: "아황산염 알레르기",
  },
  // Dietary beliefs
  vegan: {
    ja: "ヴィーガン",
    zh: "纯素食",
    th: "วีแกน",
    vi: "Thuần chay",
    en: "Vegan",
    ko: "비건",
  },
  vegetarian: {
    ja: "ベジタリアン",
    zh: "素食",
    th: "มังสวิรัติ",
    vi: "Ăn chay",
    en: "Vegetarian",
    ko: "채식",
  },
  halal: {
    ja: "ハラール",
    zh: "清真",
    th: "ฮาลาล",
    vi: "Halal",
    en: "Halal",
    ko: "할랄",
  },
  kosher: {
    ja: "コーシャ",
    zh: "犹太洁食",
    th: "โคเชอร์",
    vi: "Kosher",
    en: "Kosher",
    ko: "코셔",
  },
};

/** Ingredient names for phrase templates (not allergy labels) */
export const ALLERGEN_INGREDIENT_NAMES: Record<string, Record<string, string>> = {
  shellfish: { ja: "エビ・カニ", zh: "虾蟹", th: "กุ้ง ปู", vi: "tôm cua", en: "shellfish", ko: "새우/게" },
  peanuts: { ja: "ピーナッツ", zh: "花生", th: "ถั่วลิสง", vi: "đậu phộng", en: "peanuts", ko: "땅콩" },
  tree_nuts: { ja: "ナッツ", zh: "坚果", th: "ถั่วเปลือกแข็ง", vi: "hạt cây", en: "nuts", ko: "견과류" },
  milk: { ja: "乳製品", zh: "牛奶", th: "นม", vi: "sữa", en: "dairy", ko: "유제품" },
  eggs: { ja: "卵", zh: "鸡蛋", th: "ไข่", vi: "trứng", en: "eggs", ko: "계란" },
  egg: { ja: "卵", zh: "鸡蛋", th: "ไข่", vi: "trứng", en: "eggs", ko: "계란" },
  gluten: { ja: "小麦", zh: "面粉", th: "แป้งสาลี", vi: "gluten", en: "wheat/gluten", ko: "밀가루" },
  fish: { ja: "魚", zh: "鱼", th: "ปลา", vi: "cá", en: "fish", ko: "생선" },
  soy: { ja: "大豆", zh: "大豆", th: "ถั่วเหลือง", vi: "đậu nành", en: "soy", ko: "대두" },
  sesame: { ja: "ゴマ", zh: "芝麻", th: "งา", vi: "mè", en: "sesame", ko: "참깨" },
  celery: { ja: "セロリ", zh: "芹菜", th: "ขึ้นฉ่าย", vi: "cần tây", en: "celery", ko: "셀러리" },
  mustard: { ja: "からし", zh: "芥末", th: "มัสตาร์ด", vi: "mù tạt", en: "mustard", ko: "겨자" },
  sulfites: { ja: "亜硫酸塩", zh: "亚硫酸盐", th: "ซัลไฟต์", vi: "sulfit", en: "sulfites", ko: "아황산염" },
  dairy: { ja: "乳製品", zh: "牛奶", th: "นม", vi: "sữa", en: "dairy", ko: "유제품" },
  pork: { ja: "豚肉", zh: "猪肉", th: "หมู", vi: "thịt heo", en: "pork", ko: "돼지고기" },
  beef: { ja: "牛肉", zh: "牛肉", th: "เนื้อวัว", vi: "thịt bò", en: "beef", ko: "소고기" },
  alcohol: { ja: "お酒", zh: "酒", th: "แอลกอฮอล์", vi: "rượu", en: "alcohol", ko: "술" },
};

export const CONFIRM_LABELS: Record<string, string> = {
  ja: "確認しました",
  zh: "已确认",
  th: "ยืนยันแล้ว",
  vi: "Đã xác nhận",
  en: "Confirmed",
  ko: "확인했어요",
};

export const ORDER_HEADERS: Record<string, string> = {
  ja: "ご注文",
  zh: "您的订单",
  th: "รายการสั่ง",
  vi: "Đơn hàng",
  en: "Your Order",
  ko: "주문 목록",
};

export const DIETARY_LABELS: Record<string, Record<string, string>> = {
  vegetarian: {
    ja: "ベジタリアン", zh: "素食", th: "มังสวิรัติ", vi: "Ăn chay", en: "Vegetarian", ko: "채식",
  },
  vegan: {
    ja: "ヴィーガン", zh: "纯素", th: "วีแกน", vi: "Thuần chay", en: "Vegan", ko: "비건",
  },
  halal: {
    ja: "ハラール", zh: "清真", th: "ฮาลาล", vi: "Halal", en: "Halal", ko: "할랄",
  },
  kosher: {
    ja: "コーシャ", zh: "犹太洁食", th: "โคเชอร์", vi: "Kosher", en: "Kosher", ko: "코셔",
  },
  pescatarian: {
    ja: "ペスカタリアン", zh: "鱼素", th: "เพสคาทาเรียน", vi: "Pescatarian", en: "Pescatarian", ko: "페스코",
  },
  no_beef: {
    ja: "牛肉不可", zh: "不吃牛肉", th: "ไม่ทานเนื้อวัว", vi: "Không ăn bò", en: "No beef", ko: "소고기 금지",
  },
  no_pork: {
    ja: "豚肉不可", zh: "不吃猪肉", th: "ไม่ทานหมู", vi: "Không ăn heo", en: "No pork", ko: "돼지고기 금지",
  },
};

export const DIETARY_HEADERS: Record<string, string> = {
  ja: "食事制限があります",
  zh: "有饮食限制",
  th: "มีข้อจำกัดด้านอาหาร",
  vi: "Có hạn chế ăn uống",
  en: "Has dietary restrictions",
  ko: "식이 제한이 있어요",
};

export const ALLERGY_HEADERS: Record<string, string> = {
  ja: "アレルギーがあります",
  zh: "有过敏症",
  th: "มีอาการแพ้",
  vi: "Có dị ứng",
  en: "Has allergies",
  ko: "알레르기가 있어요",
};

export const TOTAL_LABELS: Record<string, string> = {
  ja: "合計",
  zh: "合计",
  th: "รวม",
  vi: "Tổng cộng",
  en: "Total",
  ko: "합계",
};

/**
 * Simple tip culture by country code.
 * `noteKey` resolves to `tipCulture.tipNote.<key>` in i18n JSON.
 */
export const TIP_CULTURE: Record<string, { percent: number; noteKey: string }> = {
  JP: { percent: 0, noteKey: "noTipJP" },
  KR: { percent: 0, noteKey: "noTipKR" },
  CN: { percent: 0, noteKey: "noTipCN" },
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
