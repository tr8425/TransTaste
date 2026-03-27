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

/** Simple tip culture by country code */
export const TIP_CULTURE: Record<string, { percent: number; note: string }> = {
  JP: { percent: 0, note: "No tip (Japan)" },
  KR: { percent: 0, note: "No tip (Korea)" },
  CN: { percent: 0, note: "No tip (China)" },
  TH: { percent: 0, note: "No tip (Thailand)" },
  VN: { percent: 0, note: "No tip (Vietnam)" },
  US: { percent: 18, note: "Tip 18%" },
  CA: { percent: 15, note: "Tip 15%" },
  GB: { percent: 10, note: "Tip 10%" },
  FR: { percent: 0, note: "Service included (France)" },
  IT: { percent: 0, note: "Coperto included (Italy)" },
  DE: { percent: 10, note: "Tip 10%" },
  ES: { percent: 0, note: "No tip expected (Spain)" },
  AU: { percent: 0, note: "No tip (Australia)" },
  MX: { percent: 15, note: "Tip 15%" },
};
