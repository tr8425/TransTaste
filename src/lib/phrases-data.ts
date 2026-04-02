export interface Phrase {
  key: string;
  category: 'basic' | 'order' | 'payment' | 'complaint' | 'greeting' | 'other';
  ko: string;
  translations: Record<string, { text: string; pronunciation: string }>;
  expectedResponses?: Record<string, Array<{ text: string; meaning: string }>>;
}

export const PHRASE_CATEGORIES = [
  { id: 'basic', labelKey: 'phrases.catBasic', emoji: '💧' },
  { id: 'order', labelKey: 'phrases.catOrder', emoji: '📋' },
  { id: 'payment', labelKey: 'phrases.catPayment', emoji: '💳' },
  { id: 'complaint', labelKey: 'phrases.catIssues', emoji: '⚠️' },
  { id: 'greeting', labelKey: 'phrases.catGreeting', emoji: '👋' },
  { id: 'other', labelKey: 'phrases.catOther', emoji: '💬' },
] as const;

export const PHRASES: Phrase[] = [
  // ── basic ──
  {
    key: 'water_please',
    category: 'basic',
    ko: '물 주세요',
    translations: {
      ja: { text: '水をください', pronunciation: 'Mizu o kudasai' },
      zh: { text: '请给我水', pronunciation: 'Qing gei wo shui' },
      th: { text: 'ขอน้ำหน่อยครับ/ค่ะ', pronunciation: 'Khor nam noi khrap/kha' },
      vi: { text: 'Cho tôi nước, xin', pronunciation: 'Cho toy nuoc, sin' },
      en: { text: 'Water, please', pronunciation: 'Water, please' },
      es: { text: 'Agua, por favor', pronunciation: 'Ah-gwa, por fah-vor' },
      fr: { text: 'De l\'eau, s\'il vous plaît', pronunciation: 'Duh lo, seel voo pleh' },
      it: { text: 'Acqua, per favore', pronunciation: 'Ah-kwa, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、少々お待ちください', meaning: 'Yes, please wait a moment' },
        { text: '冷たいのと温かいの、どちらがいいですか？', meaning: 'Cold or warm?' },
      ],
      zh: [
        { text: '好的，请稍等', meaning: 'OK, please wait' },
        { text: '要冰水还是温水？', meaning: 'Ice water or warm water?' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ สักครู่นะครับ/ค่ะ', meaning: 'Sure, one moment' },
        { text: 'เอาน้ำเย็นหรือน้ำอุ่นครับ/ค่ะ', meaning: 'Cold or warm water?' },
      ],
      vi: [
        { text: 'Vâng, xin chờ một chút', meaning: 'Yes, please wait a moment' },
        { text: 'Nước lạnh hay nước nóng?', meaning: 'Cold or hot water?' },
      ],
      en: [
        { text: 'Sure, just a moment', meaning: 'Sure, just a moment' },
        { text: 'Still or sparkling?', meaning: 'Still or sparkling?' },
      ],
    },
  },
  {
    key: 'more_side_dishes',
    category: 'basic',
    ko: '반찬 더 주세요',
    translations: {
      ja: { text: 'おかずをもう少しください', pronunciation: 'Okazu o mou sukoshi kudasai' },
      zh: { text: '请再给我一些小菜', pronunciation: 'Qing zai gei wo yixie xiao cai' },
      th: { text: 'ขอเครื่องเคียงเพิ่มหน่อยครับ/ค่ะ', pronunciation: 'Khor khrueang khiang phoem noi khrap/kha' },
      vi: { text: 'Cho thêm đồ ăn kèm', pronunciation: 'Cho them doh an kem' },
      en: { text: 'More side dishes, please', pronunciation: 'More side dishes, please' },
      es: { text: 'Más guarniciones, por favor', pronunciation: 'Mahs gwar-nee-see-oh-nehs, por fah-vor' },
      fr: { text: 'Plus d\'accompagnements, s\'il vous plaît', pronunciation: 'Plew dah-kom-pahn-yuh-mahn, seel voo pleh' },
      it: { text: 'Altri contorni, per favore', pronunciation: 'Ahl-tree kon-tor-nee, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、すぐお持ちします', meaning: 'Yes, I will bring it right away' },
        { text: '何がよろしいですか？', meaning: 'Which ones would you like?' },
      ],
      zh: [
        { text: '好的，马上来', meaning: 'OK, coming right up' },
        { text: '要哪种小菜？', meaning: 'Which side dishes?' },
      ],
      th: [
        { text: 'ได้เลยครับ/ค่ะ', meaning: 'Right away' },
      ],
      vi: [
        { text: 'Dạ vâng, em mang ra ngay', meaning: 'Yes, I will bring it right away' },
      ],
      en: [
        { text: 'Sure, which ones?', meaning: 'Sure, which ones?' },
        { text: 'Coming right up', meaning: 'Coming right up' },
      ],
    },
  },
  {
    key: 'change_plates',
    category: 'basic',
    ko: '접시 좀 바꿔 주세요',
    translations: {
      ja: { text: 'お皿を替えてください', pronunciation: 'Osara o kaete kudasai' },
      zh: { text: '请换一下盘子', pronunciation: 'Qing huan yixia panzi' },
      th: { text: 'ขอเปลี่ยนจานหน่อยครับ/ค่ะ', pronunciation: 'Khor plian jaan noi khrap/kha' },
      vi: { text: 'Đổi đĩa giúp tôi', pronunciation: 'Doi dia giup toy' },
      en: { text: 'Could I get a clean plate?', pronunciation: 'Could I get a clean plate?' },
      es: { text: '¿Puede cambiar el plato?', pronunciation: 'Pweh-deh kahm-bee-ahr el plah-toh?' },
      fr: { text: 'Pouvez-vous changer l\'assiette ?', pronunciation: 'Poo-vay voo shahn-zhay lah-see-et?' },
      it: { text: 'Può cambiare il piatto?', pronunciation: 'Pwo kahm-bee-ah-reh eel pee-ah-toh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、すぐお持ちします', meaning: 'Yes, right away' },
      ],
      zh: [
        { text: '好的，请稍等', meaning: 'OK, one moment' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ', meaning: 'Sure' },
      ],
      vi: [
        { text: 'Vâng ạ', meaning: 'Yes, of course' },
      ],
      en: [
        { text: 'Of course, one moment', meaning: 'Of course, one moment' },
      ],
    },
  },
  {
    key: 'take_out',
    category: 'basic',
    ko: '포장해 주세요',
    translations: {
      ja: { text: '持ち帰りでお願いします', pronunciation: 'Mochikaeri de onegaishimasu' },
      zh: { text: '请帮我打包', pronunciation: 'Qing bang wo dabao' },
      th: { text: 'ขอห่อกลับบ้านครับ/ค่ะ', pronunciation: 'Khor hor klap baan khrap/kha' },
      vi: { text: 'Cho tôi mang về', pronunciation: 'Cho toy mang veh' },
      en: { text: 'I would like to take out, please', pronunciation: 'I would like to take out, please' },
      es: { text: 'Para llevar, por favor', pronunciation: 'Pah-rah yeh-var, por fah-vor' },
      fr: { text: 'À emporter, s\'il vous plaît', pronunciation: 'Ah ahm-por-tay, seel voo pleh' },
      it: { text: 'Da asporto, per favore', pronunciation: 'Dah ah-spor-toh, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、お待ちください', meaning: 'Yes, please wait' },
        { text: '袋はご入り用ですか？', meaning: 'Do you need a bag?' },
      ],
      zh: [
        { text: '好的，要袋子吗？', meaning: 'OK, do you need a bag?' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ ใส่ถุงเลยนะครับ/ค่ะ', meaning: 'Sure, I will bag it up' },
      ],
      vi: [
        { text: 'Dạ vâng, anh/chị chờ chút', meaning: 'Yes, please wait a bit' },
      ],
      en: [
        { text: 'For here or to go?', meaning: 'For here or to go?' },
        { text: 'I will pack that up for you', meaning: 'I will pack that up for you' },
      ],
    },
  },

  // ── order ──
  {
    key: 'recommend',
    category: 'order',
    ko: '추천 메뉴가 뭐예요?',
    translations: {
      ja: { text: 'おすすめは何ですか？', pronunciation: 'Osusume wa nan desu ka?' },
      zh: { text: '有什么推荐的吗？', pronunciation: 'You shenme tuijian de ma?' },
      th: { text: 'มีอะไรแนะนำบ้างครับ/ค่ะ', pronunciation: 'Mee arai nae-nam bang khrap/kha' },
      vi: { text: 'Bạn gợi ý món gì?', pronunciation: 'Ban goy y mon gi?' },
      en: { text: 'What do you recommend?', pronunciation: 'What do you recommend?' },
      es: { text: '¿Qué recomienda?', pronunciation: 'Keh reh-koh-mee-en-dah?' },
      fr: { text: 'Que recommandez-vous ?', pronunciation: 'Kuh reh-koh-mahn-day voo?' },
      it: { text: 'Cosa consiglia?', pronunciation: 'Koh-zah kon-see-lyah?' },
    },
    expectedResponses: {
      ja: [
        { text: '今日のおすすめはこちらです', meaning: 'Today\'s recommendation is this one' },
        { text: 'これが一番人気です', meaning: 'This is the most popular' },
      ],
      zh: [
        { text: '我们的招牌菜是这个', meaning: 'Our signature dish is this one' },
        { text: '这个很受欢迎', meaning: 'This is very popular' },
      ],
      th: [
        { text: 'เมนูขายดีของเราคือตัวนี้ครับ/ค่ะ', meaning: 'Our best seller is this one' },
      ],
      vi: [
        { text: 'Món bán chạy nhất là món này', meaning: 'The best seller is this one' },
      ],
      en: [
        { text: 'Our specialty is...', meaning: 'Our specialty is...' },
        { text: 'The most popular dish is...', meaning: 'The most popular dish is...' },
      ],
    },
  },
  {
    key: 'is_spicy',
    category: 'order',
    ko: '이거 매워요?',
    translations: {
      ja: { text: 'これは辛いですか？', pronunciation: 'Kore wa karai desu ka?' },
      zh: { text: '这个辣吗？', pronunciation: 'Zhege la ma?' },
      th: { text: 'อันนี้เผ็ดไหมครับ/ค่ะ', pronunciation: 'An nee phet mai khrap/kha' },
      vi: { text: 'Mon nay co cay khong?', pronunciation: 'Mon nay co cay khong?' },
      en: { text: 'Is this spicy?', pronunciation: 'Is this spicy?' },
      es: { text: '¿Es picante?', pronunciation: 'Es pee-kahn-teh?' },
      fr: { text: 'C\'est épicé ?', pronunciation: 'Seh ay-pee-say?' },
      it: { text: 'È piccante?', pronunciation: 'Eh peek-kahn-teh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、少し辛いです', meaning: 'Yes, it is a little spicy' },
        { text: 'いいえ、辛くないです', meaning: 'No, it is not spicy' },
        { text: '辛さは調整できます', meaning: 'We can adjust the spice level' },
      ],
      zh: [
        { text: '是的，有点辣', meaning: 'Yes, it is a bit spicy' },
        { text: '不辣', meaning: 'Not spicy' },
        { text: '可以调辣度', meaning: 'We can adjust the spice level' },
      ],
      th: [
        { text: 'เผ็ดนิดหน่อยครับ/ค่ะ', meaning: 'A little spicy' },
        { text: 'ไม่เผ็ดครับ/ค่ะ', meaning: 'Not spicy' },
      ],
      vi: [
        { text: 'Hoi cay mot chut', meaning: 'A bit spicy' },
        { text: 'Khong cay', meaning: 'Not spicy' },
      ],
      en: [
        { text: 'Yes, it is quite spicy', meaning: 'Yes, it is quite spicy' },
        { text: 'Not spicy at all', meaning: 'Not spicy at all' },
        { text: 'We can make it mild', meaning: 'We can make it mild' },
      ],
    },
  },
  {
    key: 'allergen_check',
    category: 'order',
    ko: '알레르기 성분이 있나요?',
    translations: {
      ja: { text: 'アレルギー成分は含まれていますか？', pronunciation: 'Arerugii seibun wa fukumarete imasu ka?' },
      zh: { text: '有过敏成分吗？', pronunciation: 'You guomin chengfen ma?' },
      th: { text: 'มีส่วนผสมที่ก่อภูมิแพ้ไหมครับ/ค่ะ', pronunciation: 'Mee suan pasom tee kor phoom phae mai khrap/kha' },
      vi: { text: 'Mon nay co thanh phan gay di ung khong?', pronunciation: 'Mon nay co thanh fan gay zee ung khong?' },
      en: { text: 'Does this contain any allergens?', pronunciation: 'Does this contain any allergens?' },
      es: { text: '¿Contiene alérgenos?', pronunciation: 'Kon-tee-eh-neh ah-lehr-heh-nohs?' },
      fr: { text: 'Contient-il des allergènes ?', pronunciation: 'Kon-tee-ahn-teel day zah-lehr-zhen?' },
      it: { text: 'Contiene allergeni?', pronunciation: 'Kon-tee-eh-neh ah-lehr-jeh-nee?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、〇〇が含まれています', meaning: 'Yes, it contains ___' },
        { text: 'アレルギーは何ですか？', meaning: 'What is your allergy?' },
      ],
      zh: [
        { text: '含有〇〇', meaning: 'It contains ___' },
        { text: '你对什么过敏？', meaning: 'What are you allergic to?' },
      ],
      th: [
        { text: 'แพ้อะไรครับ/ค่ะ', meaning: 'What are you allergic to?' },
      ],
      vi: [
        { text: 'Ban bi di ung gi?', meaning: 'What are you allergic to?' },
      ],
      en: [
        { text: 'What allergies do you have?', meaning: 'What allergies do you have?' },
        { text: 'It contains nuts/dairy/gluten', meaning: 'It contains nuts/dairy/gluten' },
      ],
    },
  },
  {
    key: 'no_ingredient',
    category: 'order',
    ko: '___빼고 주세요',
    translations: {
      ja: { text: '___を抜きでお願いします', pronunciation: '___o nuki de onegaishimasu' },
      zh: { text: '请不要放___', pronunciation: 'Qing buyao fang ___' },
      th: { text: 'ไม่ใส่___ครับ/ค่ะ', pronunciation: 'Mai sai ___ khrap/kha' },
      vi: { text: 'Khong bo ___ vao', pronunciation: 'Khong bo ___ vao' },
      en: { text: 'No ___, please', pronunciation: 'No ___, please' },
      es: { text: 'Sin ___, por favor', pronunciation: 'Seen ___, por fah-vor' },
      fr: { text: 'Sans ___, s\'il vous plaît', pronunciation: 'Sahn ___, seel voo pleh' },
      it: { text: 'Senza ___, per favore', pronunciation: 'Sen-tsah ___, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'かしこまりました', meaning: 'Understood' },
        { text: '申し訳ありません、それは抜けません', meaning: 'Sorry, we cannot remove that' },
      ],
      zh: [
        { text: '好的，没问题', meaning: 'OK, no problem' },
        { text: '对不起，这个没办法去掉', meaning: 'Sorry, we cannot remove that' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ', meaning: 'Sure' },
        { text: 'ไม่ได้ครับ/ค่ะ เป็นส่วนผสมหลัก', meaning: 'Cannot, it is a main ingredient' },
      ],
      vi: [
        { text: 'Duoc a', meaning: 'Sure' },
        { text: 'Xin loi, khong bo ra duoc', meaning: 'Sorry, we cannot remove that' },
      ],
      en: [
        { text: 'Sure, no problem', meaning: 'Sure, no problem' },
        { text: 'Sorry, that is part of the dish', meaning: 'Sorry, that is part of the dish' },
      ],
    },
  },

  // ── payment ──
  {
    key: 'check_please',
    category: 'payment',
    ko: '계산서 주세요',
    translations: {
      ja: { text: 'お会計お願いします', pronunciation: 'Okaikei onegaishimasu' },
      zh: { text: '请买单', pronunciation: 'Qing maidan' },
      th: { text: 'เช็คบิลครับ/ค่ะ', pronunciation: 'Check bin khrap/kha' },
      vi: { text: 'Tinh tien giup toi', pronunciation: 'Tinh tien giup toy' },
      en: { text: 'Check, please', pronunciation: 'Check, please' },
      es: { text: 'La cuenta, por favor', pronunciation: 'Lah kwen-tah, por fah-vor' },
      fr: { text: 'L\'addition, s\'il vous plaît', pronunciation: 'Lah-dee-see-ohn, seel voo pleh' },
      it: { text: 'Il conto, per favore', pronunciation: 'Eel kon-toh, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、少々お待ちください', meaning: 'Yes, one moment please' },
        { text: 'レジでお会計をお願いします', meaning: 'Please pay at the register' },
      ],
      zh: [
        { text: '好的，一共是___元', meaning: 'OK, the total is ___ yuan' },
        { text: '请到前台结账', meaning: 'Please pay at the front desk' },
      ],
      th: [
        { text: 'ทั้งหมด___บาทครับ/ค่ะ', meaning: 'The total is ___ baht' },
      ],
      vi: [
        { text: 'Tong cong la ___ dong', meaning: 'The total is ___ dong' },
      ],
      en: [
        { text: 'Your total is...', meaning: 'Your total is...' },
        { text: 'I will bring that right over', meaning: 'I will bring that right over' },
      ],
    },
  },
  {
    key: 'card_payment',
    category: 'payment',
    ko: '카드 되나요?',
    translations: {
      ja: { text: 'カードは使えますか？', pronunciation: 'Kaado wa tsukaemasu ka?' },
      zh: { text: '可以刷卡吗？', pronunciation: 'Keyi shuaka ma?' },
      th: { text: 'รับบัตรเครดิตไหมครับ/ค่ะ', pronunciation: 'Rap bat credit mai khrap/kha' },
      vi: { text: 'Co the thanh toan bang the khong?', pronunciation: 'Co teh thanh toan bang teh khong?' },
      en: { text: 'Do you take card?', pronunciation: 'Do you take card?' },
      es: { text: '¿Aceptan tarjeta?', pronunciation: 'Ah-sep-tahn tar-heh-tah?' },
      fr: { text: 'Acceptez-vous la carte ?', pronunciation: 'Ak-sep-tay voo lah kart?' },
      it: { text: 'Accettate la carta?', pronunciation: 'Ah-chet-tah-teh lah kar-tah?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、使えます', meaning: 'Yes, we accept cards' },
        { text: '申し訳ありません、現金のみです', meaning: 'Sorry, cash only' },
      ],
      zh: [
        { text: '可以', meaning: 'Yes' },
        { text: '对不起，只收现金', meaning: 'Sorry, cash only' },
      ],
      th: [
        { text: 'รับครับ/ค่ะ', meaning: 'Yes, we accept cards' },
        { text: 'รับเฉพาะเงินสดครับ/ค่ะ', meaning: 'Cash only' },
      ],
      vi: [
        { text: 'Duoc a', meaning: 'Yes, we accept' },
        { text: 'Chi nhan tien mat thoi a', meaning: 'Cash only' },
      ],
      en: [
        { text: 'Yes, we accept all major cards', meaning: 'Yes, we accept all major cards' },
        { text: 'Sorry, cash only', meaning: 'Sorry, cash only' },
      ],
    },
  },
  {
    key: 'separate_checks',
    category: 'payment',
    ko: '따로따로 계산해 주세요',
    translations: {
      ja: { text: '別々に会計をお願いします', pronunciation: 'Betsubetsu ni kaikei o onegaishimasu' },
      zh: { text: '请分开结账', pronunciation: 'Qing fenkai jiezhang' },
      th: { text: 'แยกบิลครับ/ค่ะ', pronunciation: 'Yaek bin khrap/kha' },
      vi: { text: 'Tinh tien rieng giup toi', pronunciation: 'Tinh tien rieng giup toy' },
      en: { text: 'Separate checks, please', pronunciation: 'Separate checks, please' },
      es: { text: 'Cuentas separadas, por favor', pronunciation: 'Kwen-tahs seh-pah-rah-dahs, por fah-vor' },
      fr: { text: 'Additions séparées, s\'il vous plaît', pronunciation: 'Ah-dee-see-ohn say-pah-ray, seel voo pleh' },
      it: { text: 'Conti separati, per favore', pronunciation: 'Kon-tee seh-pah-rah-tee, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'かしこまりました', meaning: 'Understood' },
        { text: '申し訳ありません、一括のみです', meaning: 'Sorry, we can only do one bill' },
      ],
      zh: [
        { text: '好的', meaning: 'OK' },
        { text: '对不起，不能分开', meaning: 'Sorry, we cannot split' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ', meaning: 'Sure' },
      ],
      vi: [
        { text: 'Duoc a', meaning: 'Sure' },
      ],
      en: [
        { text: 'Sure, no problem', meaning: 'Sure, no problem' },
        { text: 'Sorry, we can only do one check', meaning: 'Sorry, we can only do one check' },
      ],
    },
  },
  {
    key: 'tax_included',
    category: 'payment',
    ko: '세금 포함이에요?',
    translations: {
      ja: { text: '税込みですか？', pronunciation: 'Zeikomi desu ka?' },
      zh: { text: '含税吗？', pronunciation: 'Han shui ma?' },
      th: { text: 'รวมภาษีแล้วหรือยังครับ/ค่ะ', pronunciation: 'Ruam phasee laew reu yang khrap/kha' },
      vi: { text: 'Da bao gom thue chua?', pronunciation: 'Da bao gom thueh chua?' },
      en: { text: 'Is tax included?', pronunciation: 'Is tax included?' },
      es: { text: '¿Incluye impuestos?', pronunciation: 'Een-kloo-yeh eem-pwes-tohs?' },
      fr: { text: 'La taxe est incluse ?', pronunciation: 'Lah tax eh an-klooz?' },
      it: { text: 'Le tasse sono incluse?', pronunciation: 'Leh tah-seh soh-noh een-kloo-zeh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、税込みです', meaning: 'Yes, tax is included' },
        { text: 'いいえ、別途かかります', meaning: 'No, tax is separate' },
      ],
      zh: [
        { text: '已经含税了', meaning: 'Tax is already included' },
        { text: '还要加税', meaning: 'Tax will be added' },
      ],
      th: [
        { text: 'รวมแล้วครับ/ค่ะ', meaning: 'It is included' },
        { text: 'ยังไม่รวมครับ/ค่ะ', meaning: 'Not included yet' },
      ],
      vi: [
        { text: 'Roi a, da bao gom', meaning: 'Yes, it is included' },
        { text: 'Chua a, cong them thue', meaning: 'No, tax will be added' },
      ],
      en: [
        { text: 'Yes, all prices include tax', meaning: 'Yes, all prices include tax' },
        { text: 'No, tax will be added', meaning: 'No, tax will be added' },
      ],
    },
  },

  // ── complaint ──
  {
    key: 'something_in_food',
    category: 'complaint',
    ko: '음식에 이물질이 있어요',
    translations: {
      ja: { text: '料理に異物が入っています', pronunciation: 'Ryouri ni ibutsu ga haitte imasu' },
      zh: { text: '食物里有异物', pronunciation: 'Shiwu li you yiwu' },
      th: { text: 'มีสิ่งแปลกปลอมในอาหารครับ/ค่ะ', pronunciation: 'Mee sing plaek plom nai ahaan khrap/kha' },
      vi: { text: 'Co vat la trong mon an', pronunciation: 'Co vat la trong mon an' },
      en: { text: 'There is something in my food', pronunciation: 'There is something in my food' },
      es: { text: 'Hay algo en mi comida', pronunciation: 'Ay ahl-goh en mee koh-mee-dah' },
      fr: { text: 'Il y a quelque chose dans mon plat', pronunciation: 'Eel ee ah kel-kuh shoz dahn mon plah' },
      it: { text: 'C\'è qualcosa nel mio piatto', pronunciation: 'Cheh kwal-koh-zah nel mee-oh pee-ah-toh' },
    },
    expectedResponses: {
      ja: [
        { text: '大変申し訳ございません、すぐにお取り替えします', meaning: 'Very sorry, we will replace it immediately' },
      ],
      zh: [
        { text: '非常抱歉，马上给您换一份', meaning: 'Very sorry, we will replace it right away' },
      ],
      th: [
        { text: 'ขอโทษมากครับ/ค่ะ เปลี่ยนให้ใหม่เลยครับ/ค่ะ', meaning: 'Very sorry, we will replace it' },
      ],
      vi: [
        { text: 'Xin loi quy khach, chung toi se doi ngay', meaning: 'Sorry, we will replace it right away' },
      ],
      en: [
        { text: 'I am so sorry, let me replace that', meaning: 'I am so sorry, let me replace that' },
      ],
    },
  },
  {
    key: 'wrong_order',
    category: 'complaint',
    ko: '이거 제가 주문한 게 아니에요',
    translations: {
      ja: { text: 'これは注文したものと違います', pronunciation: 'Kore wa chuumon shita mono to chigaimasu' },
      zh: { text: '这不是我点的', pronunciation: 'Zhe bu shi wo dian de' },
      th: { text: 'ไม่ใช่ที่สั่งครับ/ค่ะ', pronunciation: 'Mai chai tee sang khrap/kha' },
      vi: { text: 'Day khong phai mon toi dat', pronunciation: 'Day khong fai mon toy dat' },
      en: { text: 'This is not what I ordered', pronunciation: 'This is not what I ordered' },
      es: { text: 'Esto no es lo que pedí', pronunciation: 'Es-toh noh es loh keh peh-dee' },
      fr: { text: 'Ce n\'est pas ce que j\'ai commandé', pronunciation: 'Suh neh pah suh kuh zhay koh-mahn-day' },
      it: { text: 'Non è quello che ho ordinato', pronunciation: 'Non eh kwel-loh keh oh or-dee-nah-toh' },
    },
    expectedResponses: {
      ja: [
        { text: '申し訳ありません、確認いたします', meaning: 'Sorry, let me check' },
        { text: 'すぐにお直しします', meaning: 'We will fix it right away' },
      ],
      zh: [
        { text: '对不起，我确认一下', meaning: 'Sorry, let me check' },
      ],
      th: [
        { text: 'ขอโทษครับ/ค่ะ เดี๋ยวเช็คให้ครับ/ค่ะ', meaning: 'Sorry, let me check' },
      ],
      vi: [
        { text: 'Xin loi, de toi kiem tra lai', meaning: 'Sorry, let me check again' },
      ],
      en: [
        { text: 'I apologize, let me check your order', meaning: 'I apologize, let me check your order' },
      ],
    },
  },
  {
    key: 'undercooked',
    category: 'complaint',
    ko: '덜 익은 것 같아요',
    translations: {
      ja: { text: '火が通っていないようです', pronunciation: 'Hi ga tootte inai you desu' },
      zh: { text: '好像没熟', pronunciation: 'Haoxiang mei shou' },
      th: { text: 'ดูเหมือนยังไม่สุกครับ/ค่ะ', pronunciation: 'Doo meuuan yang mai suk khrap/kha' },
      vi: { text: 'Hinh nhu mon nay chua chin', pronunciation: 'Hinh nhu mon nay chua chin' },
      en: { text: 'It seems undercooked', pronunciation: 'It seems undercooked' },
      es: { text: 'Parece poco hecho', pronunciation: 'Pah-reh-seh poh-koh eh-choh' },
      fr: { text: 'Ça semble pas assez cuit', pronunciation: 'Sah sahm-bluh pah ah-say kwee' },
      it: { text: 'Sembra poco cotto', pronunciation: 'Sem-brah poh-koh kot-toh' },
    },
    expectedResponses: {
      ja: [
        { text: '申し訳ありません、もう少し焼きましょうか？', meaning: 'Sorry, shall we cook it more?' },
      ],
      zh: [
        { text: '对不起，我再给您加热一下', meaning: 'Sorry, let me heat it up more' },
      ],
      th: [
        { text: 'ขอโทษครับ/ค่ะ ทำให้ใหม่เลยครับ/ค่ะ', meaning: 'Sorry, we will redo it' },
      ],
      vi: [
        { text: 'Xin loi, de toi nau lai', meaning: 'Sorry, let me cook it again' },
      ],
      en: [
        { text: 'Sorry about that, I will have it cooked more', meaning: 'Sorry about that, I will have it cooked more' },
      ],
    },
  },
  {
    key: 'change_order',
    category: 'complaint',
    ko: '주문 바꿀 수 있나요?',
    translations: {
      ja: { text: '注文を変更できますか？', pronunciation: 'Chuumon o henkou dekimasu ka?' },
      zh: { text: '可以换一个吗？', pronunciation: 'Keyi huan yige ma?' },
      th: { text: 'เปลี่ยนออเดอร์ได้ไหมครับ/ค่ะ', pronunciation: 'Plian order dai mai khrap/kha' },
      vi: { text: 'Toi co the doi mon khong?', pronunciation: 'Toy co teh doi mon khong?' },
      en: { text: 'Can I change my order?', pronunciation: 'Can I change my order?' },
      es: { text: '¿Puedo cambiar mi pedido?', pronunciation: 'Pweh-doh kahm-bee-ahr mee peh-dee-doh?' },
      fr: { text: 'Puis-je changer ma commande ?', pronunciation: 'Pwee-zhuh shahn-zhay mah koh-mahnd?' },
      it: { text: 'Posso cambiare il mio ordine?', pronunciation: 'Pos-soh kahm-bee-ah-reh eel mee-oh or-dee-neh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、まだ間に合います', meaning: 'Yes, it is still possible' },
        { text: '申し訳ありません、もう作り始めています', meaning: 'Sorry, it is already being prepared' },
      ],
      zh: [
        { text: '可以，还来得及', meaning: 'Yes, there is still time' },
        { text: '对不起，已经开始做了', meaning: 'Sorry, it is already being made' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ ยังไม่ได้ทำ', meaning: 'Sure, it has not been made yet' },
        { text: 'ไม่ได้แล้วครับ/ค่ะ ทำไปแล้ว', meaning: 'Cannot, it is already made' },
      ],
      vi: [
        { text: 'Duoc a, chua lam', meaning: 'Sure, it has not been prepared yet' },
        { text: 'Xin loi, da lam roi', meaning: 'Sorry, it is already done' },
      ],
      en: [
        { text: 'Sure, what would you like instead?', meaning: 'Sure, what would you like instead?' },
        { text: 'Sorry, it is already being prepared', meaning: 'Sorry, it is already being prepared' },
      ],
    },
  },

  // ── greeting ──
  {
    key: 'enjoy_meal',
    category: 'greeting',
    ko: '잘 먹겠습니다',
    translations: {
      ja: { text: 'いただきます', pronunciation: 'Itadakimasu' },
      zh: { text: '我开动了', pronunciation: 'Wo kaidong le' },
      th: { text: 'ขอบคุณสำหรับอาหารครับ/ค่ะ', pronunciation: 'Khob khun samrap ahaan khrap/kha' },
      vi: { text: 'Toi xin phep dung bua', pronunciation: 'Toy sin fep dung bua' },
      en: { text: 'Bon appetit / Time to eat!', pronunciation: 'Bon appetit' },
      es: { text: '¡Buen provecho!', pronunciation: 'Bwen proh-veh-choh!' },
      fr: { text: 'Bon appétit !', pronunciation: 'Bon ah-pay-tee!' },
      it: { text: 'Buon appetito!', pronunciation: 'Bwon ah-peh-tee-toh!' },
    },
    expectedResponses: {
      ja: [
        { text: 'ごゆっくりどうぞ', meaning: 'Please take your time and enjoy' },
      ],
      zh: [
        { text: '请慢用', meaning: 'Please enjoy' },
      ],
      th: [
        { text: 'ทานให้อร่อยนะครับ/ค่ะ', meaning: 'Enjoy your meal' },
      ],
      vi: [
        { text: 'Moi anh/chi dung bua', meaning: 'Please enjoy your meal' },
      ],
      en: [
        { text: 'Enjoy your meal!', meaning: 'Enjoy your meal!' },
      ],
    },
  },
  {
    key: 'delicious',
    category: 'greeting',
    ko: '맛있어요!',
    translations: {
      ja: { text: 'おいしいです！', pronunciation: 'Oishii desu!' },
      zh: { text: '很好吃！', pronunciation: 'Hen hao chi!' },
      th: { text: 'อร่อยมากครับ/ค่ะ', pronunciation: 'Aroi mak khrap/kha' },
      vi: { text: 'Ngon lam!', pronunciation: 'Ngon lam!' },
      en: { text: 'Delicious!', pronunciation: 'Delicious!' },
      es: { text: '¡Delicioso!', pronunciation: 'Deh-lee-see-oh-soh!' },
      fr: { text: 'Délicieux !', pronunciation: 'Day-lee-see-uh!' },
      it: { text: 'Delizioso!', pronunciation: 'Deh-lee-tsee-oh-zoh!' },
    },
    expectedResponses: {
      ja: [
        { text: 'ありがとうございます', meaning: 'Thank you' },
      ],
      zh: [
        { text: '谢谢！', meaning: 'Thank you!' },
      ],
      th: [
        { text: 'ขอบคุณครับ/ค่ะ', meaning: 'Thank you' },
      ],
      vi: [
        { text: 'Cam on anh/chi!', meaning: 'Thank you!' },
      ],
      en: [
        { text: 'Thank you, glad you like it!', meaning: 'Thank you, glad you like it!' },
      ],
    },
  },
  {
    key: 'great_cook',
    category: 'greeting',
    ko: '요리를 정말 잘하시네요',
    translations: {
      ja: { text: '料理がとても上手ですね', pronunciation: 'Ryouri ga totemo jouzu desu ne' },
      zh: { text: '厨艺真好', pronunciation: 'Chuyi zhen hao' },
      th: { text: 'ทำอาหารอร่อยมากครับ/ค่ะ', pronunciation: 'Tham ahaan aroi mak khrap/kha' },
      vi: { text: 'Nau an ngon qua!', pronunciation: 'Nau an ngon qua!' },
      en: { text: 'The chef is amazing!', pronunciation: 'The chef is amazing!' },
      es: { text: '¡El chef es increíble!', pronunciation: 'El chef es een-kreh-ee-bleh!' },
      fr: { text: 'Le chef est incroyable !', pronunciation: 'Luh shef eh an-krwah-yah-bluh!' },
      it: { text: 'Lo chef è fantastico!', pronunciation: 'Loh shef eh fan-tah-stee-koh!' },
    },
    expectedResponses: {
      ja: [
        { text: 'ありがとうございます、嬉しいです', meaning: 'Thank you, I am happy to hear that' },
      ],
      zh: [
        { text: '谢谢夸奖', meaning: 'Thank you for the compliment' },
      ],
      th: [
        { text: 'ขอบคุณมากครับ/ค่ะ', meaning: 'Thank you very much' },
      ],
      vi: [
        { text: 'Cam on nhieu!', meaning: 'Thank you so much!' },
      ],
      en: [
        { text: 'I will let the chef know, thank you!', meaning: 'I will let the chef know, thank you!' },
      ],
    },
  },
  {
    key: 'thanks_for_meal',
    category: 'greeting',
    ko: '잘 먹었습니다',
    translations: {
      ja: { text: 'ごちそうさまでした', pronunciation: 'Gochisousama deshita' },
      zh: { text: '谢谢款待', pronunciation: 'Xiexie kuandai' },
      th: { text: 'ขอบคุณสำหรับอาหารครับ/ค่ะ อร่อยมาก', pronunciation: 'Khob khun samrap ahaan khrap/kha aroi mak' },
      vi: { text: 'Cam on bua an rat ngon', pronunciation: 'Cam on bua an rat ngon' },
      en: { text: 'Thank you for the meal', pronunciation: 'Thank you for the meal' },
      es: { text: 'Gracias por la comida', pronunciation: 'Grah-see-ahs por lah koh-mee-dah' },
      fr: { text: 'Merci pour le repas', pronunciation: 'Mehr-see poor luh ruh-pah' },
      it: { text: 'Grazie per il pasto', pronunciation: 'Grah-tsee-eh per eel pah-stoh' },
    },
    expectedResponses: {
      ja: [
        { text: 'ありがとうございました、またお越しください', meaning: 'Thank you, please come again' },
      ],
      zh: [
        { text: '谢谢光临，欢迎再来', meaning: 'Thank you for coming, please visit again' },
      ],
      th: [
        { text: 'ขอบคุณครับ/ค่ะ มาอีกนะครับ/ค่ะ', meaning: 'Thank you, please come again' },
      ],
      vi: [
        { text: 'Cam on, hen gap lai!', meaning: 'Thank you, see you again!' },
      ],
      en: [
        { text: 'Thank you, please come again!', meaning: 'Thank you, please come again!' },
      ],
    },
  },

  // ── other ──
  {
    key: 'table_for_n',
    category: 'other',
    ko: '___명이요',
    translations: {
      ja: { text: '___名です', pronunciation: '___mei desu' },
      zh: { text: '___位', pronunciation: '___wei' },
      th: { text: '___ที่ครับ/ค่ะ', pronunciation: '___tee khrap/kha' },
      vi: { text: '___nguoi', pronunciation: '___nguoi' },
      en: { text: 'Table for ___, please', pronunciation: 'Table for ___, please' },
      es: { text: 'Mesa para ___, por favor', pronunciation: 'Meh-sah pah-rah ___, por fah-vor' },
      fr: { text: 'Table pour ___, s\'il vous plaît', pronunciation: 'Tah-bluh poor ___, seel voo pleh' },
      it: { text: 'Tavolo per ___, per favore', pronunciation: 'Tah-voh-loh per ___, per fah-voh-reh' },
    },
    expectedResponses: {
      ja: [
        { text: 'こちらへどうぞ', meaning: 'This way, please' },
        { text: '少々お待ちください', meaning: 'Please wait a moment' },
      ],
      zh: [
        { text: '请跟我来', meaning: 'Please follow me' },
        { text: '请稍等，马上安排', meaning: 'Please wait, we will arrange it soon' },
      ],
      th: [
        { text: 'เชิญทางนี้ครับ/ค่ะ', meaning: 'This way, please' },
        { text: 'รอสักครู่นะครับ/ค่ะ', meaning: 'Please wait a moment' },
      ],
      vi: [
        { text: 'Moi di theo toi', meaning: 'Please follow me' },
        { text: 'Xin cho mot lat', meaning: 'Please wait a moment' },
      ],
      en: [
        { text: 'Right this way', meaning: 'Right this way' },
        { text: 'It will be about a ___ minute wait', meaning: 'It will be about a ___ minute wait' },
      ],
    },
  },
  {
    key: 'reservation',
    category: 'other',
    ko: '예약했어요',
    translations: {
      ja: { text: '予約しています', pronunciation: 'Yoyaku shite imasu' },
      zh: { text: '我有预约', pronunciation: 'Wo you yuyue' },
      th: { text: 'จองโต๊ะไว้แล้วครับ/ค่ะ', pronunciation: 'Jong to wai laew khrap/kha' },
      vi: { text: 'Toi da dat truoc', pronunciation: 'Toy da dat truoc' },
      en: { text: 'I have a reservation', pronunciation: 'I have a reservation' },
      es: { text: 'Tengo una reserva', pronunciation: 'Ten-goh oo-nah reh-ser-vah' },
      fr: { text: 'J\'ai une réservation', pronunciation: 'Zhay oon ray-ser-vah-see-ohn' },
      it: { text: 'Ho una prenotazione', pronunciation: 'Oh oo-nah preh-noh-tah-tsee-oh-neh' },
    },
    expectedResponses: {
      ja: [
        { text: 'お名前をお伺いできますか？', meaning: 'May I have your name?' },
      ],
      zh: [
        { text: '请问贵姓？', meaning: 'What is your name?' },
      ],
      th: [
        { text: 'จองในชื่ออะไรครับ/ค่ะ', meaning: 'Under what name?' },
      ],
      vi: [
        { text: 'Dat duoi ten gi a?', meaning: 'Under what name?' },
      ],
      en: [
        { text: 'Under what name?', meaning: 'Under what name?' },
      ],
    },
  },
  {
    key: 'restroom',
    category: 'other',
    ko: '화장실이 어디예요?',
    translations: {
      ja: { text: 'お手洗いはどこですか？', pronunciation: 'Otearai wa doko desu ka?' },
      zh: { text: '洗手间在哪里？', pronunciation: 'Xishoujian zai nali?' },
      th: { text: 'ห้องน้ำอยู่ตรงไหนครับ/ค่ะ', pronunciation: 'Hong nam yoo trong nai khrap/kha' },
      vi: { text: 'Nha ve sinh o dau?', pronunciation: 'Nha veh sinh o dau?' },
      en: { text: 'Where is the restroom?', pronunciation: 'Where is the restroom?' },
      es: { text: '¿Dónde está el baño?', pronunciation: 'Don-deh es-tah el bah-nyoh?' },
      fr: { text: 'Où sont les toilettes ?', pronunciation: 'Oo son lay twah-let?' },
      it: { text: 'Dov\'è il bagno?', pronunciation: 'Doh-veh eel bah-nyoh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'あちらです', meaning: 'It is over there' },
        { text: '奥の右側です', meaning: 'At the back, on the right' },
      ],
      zh: [
        { text: '在那边', meaning: 'Over there' },
        { text: '往里面走，右手边', meaning: 'Go inside, on the right' },
      ],
      th: [
        { text: 'ตรงนั้นครับ/ค่ะ', meaning: 'Over there' },
        { text: 'เดินตรงไปแล้วเลี้ยวขวาครับ/ค่ะ', meaning: 'Go straight and turn right' },
      ],
      vi: [
        { text: 'O dang kia', meaning: 'Over there' },
        { text: 'Di thang roi re phai', meaning: 'Go straight then turn right' },
      ],
      en: [
        { text: 'Down the hall on your right', meaning: 'Down the hall on your right' },
      ],
    },
  },
  {
    key: 'sit_outside',
    category: 'other',
    ko: '밖에 앉을 수 있나요?',
    translations: {
      ja: { text: '外の席はありますか？', pronunciation: 'Soto no seki wa arimasu ka?' },
      zh: { text: '可以坐外面吗？', pronunciation: 'Keyi zuo waimian ma?' },
      th: { text: 'นั่งข้างนอกได้ไหมครับ/ค่ะ', pronunciation: 'Nang khang nok dai mai khrap/kha' },
      vi: { text: 'Co the ngoi ngoai troi khong?', pronunciation: 'Co teh ngoi ngoai troi khong?' },
      en: { text: 'Can we sit outside?', pronunciation: 'Can we sit outside?' },
      es: { text: '¿Podemos sentarnos afuera?', pronunciation: 'Poh-deh-mohs sen-tar-nohs ah-fweh-rah?' },
      fr: { text: 'Peut-on s\'asseoir dehors ?', pronunciation: 'Puh-ton sah-swahr duh-or?' },
      it: { text: 'Possiamo sederci fuori?', pronunciation: 'Pos-see-ah-moh seh-der-chee fwoh-ree?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、こちらへどうぞ', meaning: 'Yes, this way please' },
        { text: '申し訳ありません、外席は満席です', meaning: 'Sorry, outdoor seats are full' },
      ],
      zh: [
        { text: '可以，请跟我来', meaning: 'Yes, follow me' },
        { text: '外面满了', meaning: 'Outside is full' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ เชิญทางนี้', meaning: 'Sure, this way' },
        { text: 'ข้างนอกเต็มแล้วครับ/ค่ะ', meaning: 'Outside is full' },
      ],
      vi: [
        { text: 'Duoc a, moi di theo toi', meaning: 'Sure, follow me' },
        { text: 'Ben ngoai het cho roi a', meaning: 'Outside is full' },
      ],
      en: [
        { text: 'Sure, follow me', meaning: 'Sure, follow me' },
        { text: 'Sorry, outside seating is full', meaning: 'Sorry, outside seating is full' },
      ],
    },
  },

  // ── NEW: basic (additional) ──
  {
    key: 'see_menu',
    category: 'basic',
    ko: '메뉴판 볼 수 있을까요?',
    translations: {
      ja: { text: 'メニューを見せてください', pronunciation: 'Menyuu o misete kudasai' },
      zh: { text: '请给我看菜单', pronunciation: 'Qing gei wo kan caidan' },
      th: { text: 'ขอดูเมนูหน่อยครับ/ค่ะ', pronunciation: 'Khor duu menu noi khrap/kha' },
      vi: { text: 'Cho tôi xem thực đơn', pronunciation: 'Cho toy sem tuc don' },
      en: { text: 'Can I see the menu, please?', pronunciation: 'Can I see the menu, please?' },
      es: { text: '¿Puedo ver el menú?', pronunciation: 'Pweh-doh ver el meh-noo?' },
      fr: { text: 'Puis-je voir le menu ?', pronunciation: 'Pwee-zhuh vwahr luh muh-noo?' },
      it: { text: 'Posso vedere il menu?', pronunciation: 'Pos-soh veh-deh-reh eel meh-noo?' },
    },
  },
  {
    key: 'english_menu',
    category: 'basic',
    ko: '영어 메뉴 있나요?',
    translations: {
      ja: { text: '英語のメニューはありますか？', pronunciation: 'Eigo no menyuu wa arimasu ka?' },
      zh: { text: '有英文菜单吗？', pronunciation: 'You yingwen caidan ma?' },
      th: { text: 'มีเมนูภาษาอังกฤษไหมครับ/ค่ะ', pronunciation: 'Mii menu phasa angkrit mai khrap/kha' },
      vi: { text: 'Có thực đơn tiếng Anh không?', pronunciation: 'Co tuc don tieng Anh khong?' },
      en: { text: 'Do you have an English menu?', pronunciation: 'Do you have an English menu?' },
      es: { text: '¿Tienen menú en inglés?', pronunciation: 'Tee-eh-nen meh-noo en een-glehs?' },
      fr: { text: 'Avez-vous un menu en anglais ?', pronunciation: 'Ah-vay voo uhn muh-noo ahn ahn-gleh?' },
      it: { text: 'Avete un menu in inglese?', pronunciation: 'Ah-veh-teh oon meh-noo een een-gleh-zeh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、こちらです', meaning: 'Yes, here it is' },
        { text: '申し訳ありません、日本語のみです', meaning: 'Sorry, only Japanese' },
      ],
      zh: [
        { text: '有的，请稍等', meaning: 'Yes, one moment' },
        { text: '对不起，只有中文的', meaning: 'Sorry, only Chinese' },
      ],
      th: [
        { text: 'มีครับ/ค่ะ เดี๋ยวเอามาให้', meaning: 'Yes, I will bring it' },
        { text: 'ไม่มีครับ/ค่ะ', meaning: 'No, we don\'t' },
      ],
      vi: [
        { text: 'Có ạ, đây ạ', meaning: 'Yes, here it is' },
        { text: 'Xin lỗi, chỉ có tiếng Việt', meaning: 'Sorry, only Vietnamese' },
      ],
      en: [
        { text: 'Yes, here you go', meaning: 'Yes, here you go' },
        { text: 'Sorry, we only have the local menu', meaning: 'Sorry, we only have the local menu' },
      ],
    },
  },
  {
    key: 'napkins_please',
    category: 'basic',
    ko: '냅킨 좀 주세요',
    translations: {
      ja: { text: 'ナプキンをください', pronunciation: 'Napukin o kudasai' },
      zh: { text: '请给我纸巾', pronunciation: 'Qing gei wo zhijin' },
      th: { text: 'ขอทิชชู่หน่อยครับ/ค่ะ', pronunciation: 'Khor tissue noi khrap/kha' },
      vi: { text: 'Cho tôi khăn giấy', pronunciation: 'Cho toy khan giay' },
      en: { text: 'Napkins, please', pronunciation: 'Napkins, please' },
      es: { text: 'Servilletas, por favor', pronunciation: 'Ser-vee-yeh-tahs, por fah-vor' },
      fr: { text: 'Des serviettes, s\'il vous plaît', pronunciation: 'Day ser-vee-et, seel voo pleh' },
      it: { text: 'Tovaglioli, per favore', pronunciation: 'Toh-vah-lyoh-lee, per fah-voh-reh' },
    },
  },
  {
    key: 'utensils_please',
    category: 'basic',
    ko: '포크/숟가락 주세요',
    translations: {
      ja: { text: 'フォーク/スプーンをください', pronunciation: 'Fooku/supuun o kudasai' },
      zh: { text: '请给我叉子/勺子', pronunciation: 'Qing gei wo chazi/shaozi' },
      th: { text: 'ขอช้อนส้อมหน่อยครับ/ค่ะ', pronunciation: 'Khor chon som noi khrap/kha' },
      vi: { text: 'Cho tôi nĩa/muỗng', pronunciation: 'Cho toy nia/muong' },
      en: { text: 'Fork/spoon, please', pronunciation: 'Fork/spoon, please' },
      es: { text: 'Tenedor/cuchara, por favor', pronunciation: 'Teh-neh-dor/koo-chah-rah, por fah-vor' },
      fr: { text: 'Fourchette/cuillère, s\'il vous plaît', pronunciation: 'Foor-shet/kwee-yehr, seel voo pleh' },
      it: { text: 'Forchetta/cucchiaio, per favore', pronunciation: 'For-ket-tah/koo-kee-ah-yoh, per fah-voh-reh' },
    },
  },

  // ── NEW: order (additional) ──
  {
    key: 'is_halal',
    category: 'order',
    ko: '이 음식 할랄인가요?',
    translations: {
      ja: { text: 'この料理はハラールですか？', pronunciation: 'Kono ryouri wa haraaru desu ka?' },
      zh: { text: '这道菜是清真的吗？', pronunciation: 'Zhe dao cai shi qingzhen de ma?' },
      th: { text: 'อาหารนี้ฮาลาลไหมครับ/ค่ะ', pronunciation: 'Aahaan nii halal mai khrap/kha' },
      vi: { text: 'Món này có halal không?', pronunciation: 'Mon nay co halal khong?' },
      en: { text: 'Is this dish halal?', pronunciation: 'Is this dish halal?' },
      es: { text: '¿Este plato es halal?', pronunciation: 'Es-teh plah-toh es ah-lahl?' },
      fr: { text: 'Ce plat est-il halal ?', pronunciation: 'Suh plah eh-teel ah-lahl?' },
      it: { text: 'Questo piatto è halal?', pronunciation: 'Kwes-toh pee-ah-toh eh ah-lahl?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、ハラールです', meaning: 'Yes, it is halal' },
        { text: '豚肉が入っています', meaning: 'It contains pork' },
      ],
      zh: [
        { text: '是的，这是清真的', meaning: 'Yes, it is halal' },
        { text: '含有猪肉', meaning: 'It contains pork' },
      ],
      th: [
        { text: 'ใช่ครับ/ค่ะ เป็นฮาลาล', meaning: 'Yes, it is halal' },
        { text: 'มีหมูครับ/ค่ะ', meaning: 'It contains pork' },
      ],
      vi: [
        { text: 'Vâng, món này halal', meaning: 'Yes, it is halal' },
        { text: 'Có thịt heo ạ', meaning: 'It contains pork' },
      ],
      en: [
        { text: 'Yes, it\'s halal', meaning: 'Yes, it is halal' },
        { text: 'No, it contains pork', meaning: 'No, it contains pork' },
      ],
    },
  },
  {
    key: 'is_vegetarian',
    category: 'order',
    ko: '채식 메뉴 있나요?',
    translations: {
      ja: { text: 'ベジタリアンメニューはありますか？', pronunciation: 'Bejitarian menyuu wa arimasu ka?' },
      zh: { text: '有素食菜吗？', pronunciation: 'You sushi cai ma?' },
      th: { text: 'มีอาหารมังสวิรัติไหมครับ/ค่ะ', pronunciation: 'Mii aahaan mangsawirat mai khrap/kha' },
      vi: { text: 'Có món chay không?', pronunciation: 'Co mon chay khong?' },
      en: { text: 'Do you have vegetarian options?', pronunciation: 'Do you have vegetarian options?' },
      es: { text: '¿Tienen opciones vegetarianas?', pronunciation: 'Tee-eh-nen op-see-oh-nehs veh-heh-tah-ree-ah-nahs?' },
      fr: { text: 'Avez-vous des options végétariennes ?', pronunciation: 'Ah-vay voo day zop-see-ohn vay-zhay-tah-ree-en?' },
      it: { text: 'Avete opzioni vegetariane?', pronunciation: 'Ah-veh-teh op-tsee-oh-nee veh-jeh-tah-ree-ah-neh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、こちらがベジタリアンメニューです', meaning: 'Yes, here is the vegetarian menu' },
        { text: '申し訳ありません、ベジタリアンメニューはありません', meaning: 'Sorry, no vegetarian menu' },
      ],
      zh: [
        { text: '有的，这些是素菜', meaning: 'Yes, these are vegetarian dishes' },
        { text: '对不起，没有素食选项', meaning: 'Sorry, no vegetarian options' },
      ],
      th: [
        { text: 'มีครับ/ค่ะ', meaning: 'Yes, we do' },
        { text: 'ไม่มีครับ/ค่ะ', meaning: 'No, we don\'t' },
      ],
      vi: [
        { text: 'Có ạ', meaning: 'Yes, we do' },
        { text: 'Xin lỗi, không có ạ', meaning: 'Sorry, we don\'t' },
      ],
      en: [
        { text: 'Yes, I can show you', meaning: 'Yes, I can show you' },
        { text: 'Sorry, we don\'t have vegetarian options', meaning: 'Sorry, we don\'t have vegetarian options' },
      ],
    },
  },
  {
    key: 'how_long',
    category: 'order',
    ko: '얼마나 걸리나요?',
    translations: {
      ja: { text: 'どのくらい時間がかかりますか？', pronunciation: 'Dono kurai jikan ga kakarimasu ka?' },
      zh: { text: '要等多久？', pronunciation: 'Yao deng duo jiu?' },
      th: { text: 'ใช้เวลานานแค่ไหนครับ/ค่ะ', pronunciation: 'Chai wela naan khae nai khrap/kha' },
      vi: { text: 'Mất bao lâu ạ?', pronunciation: 'Mat bao lau a?' },
      en: { text: 'How long will it take?', pronunciation: 'How long will it take?' },
      es: { text: '¿Cuánto tiempo tardará?', pronunciation: 'Kwahn-toh tee-em-poh tar-dah-rah?' },
      fr: { text: 'Combien de temps faut-il ?', pronunciation: 'Kom-bee-an duh tahn foh-teel?' },
      it: { text: 'Quanto tempo ci vorrà?', pronunciation: 'Kwahn-toh tem-poh chee vor-rah?' },
    },
    expectedResponses: {
      ja: [
        { text: '10分くらいです', meaning: 'About 10 minutes' },
        { text: '少々お待ちください', meaning: 'Please wait a moment' },
      ],
      zh: [
        { text: '大概10分钟', meaning: 'About 10 minutes' },
        { text: '马上就好', meaning: 'It will be ready soon' },
      ],
      th: [
        { text: 'ประมาณ 10 นาทีครับ/ค่ะ', meaning: 'About 10 minutes' },
        { text: 'อีกสักครู่ครับ/ค่ะ', meaning: 'Just a moment' },
      ],
      vi: [
        { text: 'Khoảng 10 phút ạ', meaning: 'About 10 minutes' },
        { text: 'Một chút nữa ạ', meaning: 'Just a moment' },
      ],
      en: [
        { text: 'About 10 minutes', meaning: 'About 10 minutes' },
        { text: 'It\'ll be right out', meaning: 'It\'ll be right out' },
      ],
    },
  },
  {
    key: 'same_as_that',
    category: 'order',
    ko: '저 테이블이랑 같은 거 주세요',
    translations: {
      ja: { text: 'あのテーブルと同じものをください', pronunciation: 'Ano teeburu to onaji mono o kudasai' },
      zh: { text: '我要和那桌一样的', pronunciation: 'Wo yao he na zhuo yiyang de' },
      th: { text: 'ขอเหมือนโต๊ะนั้นครับ/ค่ะ', pronunciation: 'Khor muean to nan khrap/kha' },
      vi: { text: 'Cho tôi giống bàn kia', pronunciation: 'Cho toy giong ban kia' },
      en: { text: 'I\'ll have what that table is having', pronunciation: 'I\'ll have what that table is having' },
      es: { text: 'Quiero lo mismo que esa mesa', pronunciation: 'Kee-eh-roh loh mees-moh keh eh-sah meh-sah' },
      fr: { text: 'Je voudrais la même chose que cette table', pronunciation: 'Zhuh voo-dreh lah mem shoz kuh set tah-bluh' },
      it: { text: 'Vorrei lo stesso di quel tavolo', pronunciation: 'Vor-ray loh stes-soh dee kwel tah-voh-loh' },
    },
  },

  // ── NEW: payment (additional) ──
  {
    key: 'tip_included',
    category: 'payment',
    ko: '팁이 포함되어 있나요?',
    translations: {
      ja: { text: 'サービス料は含まれていますか？', pronunciation: 'Saabisu ryou wa fukumarete imasu ka?' },
      zh: { text: '包含小费吗？', pronunciation: 'Baohan xiaofei ma?' },
      th: { text: 'รวมทิปแล้วหรือยังครับ/ค่ะ', pronunciation: 'Ruam tip laew ru yang khrap/kha' },
      vi: { text: 'Đã bao gồm tiền tip chưa?', pronunciation: 'Da bao gom tien tip chua?' },
      en: { text: 'Is the tip included?', pronunciation: 'Is the tip included?' },
      es: { text: '¿Está incluida la propina?', pronunciation: 'Es-tah een-kloo-ee-dah lah proh-pee-nah?' },
      fr: { text: 'Le pourboire est inclus ?', pronunciation: 'Luh poor-bwahr eh an-kloo?' },
      it: { text: 'La mancia è inclusa?', pronunciation: 'Lah mahn-chah eh een-kloo-zah?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、サービス料込みです', meaning: 'Yes, service charge is included' },
        { text: 'いいえ、含まれていません', meaning: 'No, it is not included' },
      ],
      zh: [
        { text: '是的，已经包含了', meaning: 'Yes, it is included' },
        { text: '没有包含', meaning: 'No, it is not included' },
      ],
      th: [
        { text: 'รวมแล้วครับ/ค่ะ', meaning: 'Yes, included' },
        { text: 'ยังไม่รวมครับ/ค่ะ', meaning: 'Not yet included' },
      ],
      vi: [
        { text: 'Rồi ạ', meaning: 'Yes, included' },
        { text: 'Chưa ạ', meaning: 'Not yet' },
      ],
      en: [
        { text: 'Yes, service charge is included', meaning: 'Yes, service charge is included' },
        { text: 'No, tip is separate', meaning: 'No, tip is separate' },
      ],
    },
  },
  {
    key: 'receipt_please',
    category: 'payment',
    ko: '영수증 주세요',
    translations: {
      ja: { text: '領収書をください', pronunciation: 'Ryoushuusho o kudasai' },
      zh: { text: '请给我发票', pronunciation: 'Qing gei wo fapiao' },
      th: { text: 'ขอใบเสร็จหน่อยครับ/ค่ะ', pronunciation: 'Khor bai set noi khrap/kha' },
      vi: { text: 'Cho tôi hóa đơn', pronunciation: 'Cho toy hoa don' },
      en: { text: 'Receipt, please', pronunciation: 'Receipt, please' },
      es: { text: 'El recibo, por favor', pronunciation: 'El reh-see-boh, por fah-vor' },
      fr: { text: 'Le reçu, s\'il vous plaît', pronunciation: 'Luh ruh-soo, seel voo pleh' },
      it: { text: 'Lo scontrino, per favore', pronunciation: 'Loh skon-tree-noh, per fah-voh-reh' },
    },
  },

  // ── NEW: complaint (additional) ──
  {
    key: 'too_salty',
    category: 'complaint',
    ko: '너무 짜요',
    translations: {
      ja: { text: 'ちょっとしょっぱいです', pronunciation: 'Chotto shoppai desu' },
      zh: { text: '太咸了', pronunciation: 'Tai xian le' },
      th: { text: 'เค็มไปครับ/ค่ะ', pronunciation: 'Khem pai khrap/kha' },
      vi: { text: 'Mặn quá', pronunciation: 'Man qua' },
      en: { text: 'This is too salty', pronunciation: 'This is too salty' },
      es: { text: 'Está muy salado', pronunciation: 'Es-tah mwee sah-lah-doh' },
      fr: { text: 'C\'est trop salé', pronunciation: 'Seh troh sah-lay' },
      it: { text: 'È troppo salato', pronunciation: 'Eh trop-poh sah-lah-toh' },
    },
  },
  {
    key: 'not_what_ordered',
    category: 'complaint',
    ko: '주문한 것과 달라요',
    translations: {
      ja: { text: '注文したものと違います', pronunciation: 'Chuumon shita mono to chigaimasu' },
      zh: { text: '这不是我点的', pronunciation: 'Zhe bu shi wo dian de' },
      th: { text: 'ไม่ใช่ที่สั่งครับ/ค่ะ', pronunciation: 'Mai chai thi sang khrap/kha' },
      vi: { text: 'Đây không phải món tôi gọi', pronunciation: 'Day khong phai mon toy goi' },
      en: { text: 'This is not what I ordered', pronunciation: 'This is not what I ordered' },
      es: { text: 'Esto no es lo que pedí', pronunciation: 'Es-toh noh es loh keh peh-dee' },
      fr: { text: 'Ce n\'est pas ma commande', pronunciation: 'Suh neh pah mah koh-mahnd' },
      it: { text: 'Non è il mio ordine', pronunciation: 'Non eh eel mee-oh or-dee-neh' },
    },
  },

  // ── NEW: greeting (additional) ──
  {
    key: 'hello',
    category: 'greeting',
    ko: '안녕하세요',
    translations: {
      ja: { text: 'こんにちは', pronunciation: 'Konnichiwa' },
      zh: { text: '你好', pronunciation: 'Ni hao' },
      th: { text: 'สวัสดีครับ/ค่ะ', pronunciation: 'Sawasdee khrap/kha' },
      vi: { text: 'Xin chào', pronunciation: 'Sin chao' },
      en: { text: 'Hello', pronunciation: 'Hello' },
      es: { text: 'Hola', pronunciation: 'Oh-lah' },
      fr: { text: 'Bonjour', pronunciation: 'Bon-zhoor' },
      it: { text: 'Buongiorno', pronunciation: 'Bwon-jor-noh' },
    },
  },
  {
    key: 'goodbye',
    category: 'greeting',
    ko: '잘 먹었습니다, 안녕히 계세요',
    translations: {
      ja: { text: 'ごちそうさまでした', pronunciation: 'Gochisousama deshita' },
      zh: { text: '吃好了，谢谢', pronunciation: 'Chi hao le, xiexie' },
      th: { text: 'อิ่มแล้วครับ/ค่ะ ขอบคุณครับ/ค่ะ', pronunciation: 'Im laew khrap/kha, khop khun khrap/kha' },
      vi: { text: 'Ăn ngon lắm, cảm ơn', pronunciation: 'An ngon lam, cam on' },
      en: { text: 'That was great, thank you', pronunciation: 'That was great, thank you' },
      es: { text: 'Estaba delicioso, gracias', pronunciation: 'Es-tah-bah deh-lee-see-oh-soh, grah-see-ahs' },
      fr: { text: 'C\'était délicieux, merci', pronunciation: 'Seh-teh day-lee-see-uh, mehr-see' },
      it: { text: 'Era delizioso, grazie', pronunciation: 'Eh-rah deh-lee-tsee-oh-zoh, grah-tsee-eh' },
    },
  },

  // ── NEW: other (additional) ──
  {
    key: 'can_take_photo',
    category: 'other',
    ko: '사진 찍어도 될까요?',
    translations: {
      ja: { text: '写真を撮ってもいいですか？', pronunciation: 'Shashin o totte mo ii desu ka?' },
      zh: { text: '可以拍照吗？', pronunciation: 'Keyi paizhao ma?' },
      th: { text: 'ถ่ายรูปได้ไหมครับ/ค่ะ', pronunciation: 'Thai ruup dai mai khrap/kha' },
      vi: { text: 'Tôi có thể chụp ảnh không?', pronunciation: 'Toy co the chup anh khong?' },
      en: { text: 'Can I take a photo?', pronunciation: 'Can I take a photo?' },
      es: { text: '¿Puedo tomar una foto?', pronunciation: 'Pweh-doh toh-mahr oo-nah foh-toh?' },
      fr: { text: 'Puis-je prendre une photo ?', pronunciation: 'Pwee-zhuh prahn-druh oon foh-toh?' },
      it: { text: 'Posso fare una foto?', pronunciation: 'Pos-soh fah-reh oo-nah foh-toh?' },
    },
    expectedResponses: {
      ja: [
        { text: 'はい、どうぞ', meaning: 'Yes, go ahead' },
        { text: '申し訳ありません、撮影はご遠慮ください', meaning: 'Sorry, no photos please' },
      ],
      zh: [
        { text: '可以的', meaning: 'Yes, you can' },
        { text: '对不起，不可以拍照', meaning: 'Sorry, no photos' },
      ],
      th: [
        { text: 'ได้ครับ/ค่ะ', meaning: 'Yes, you can' },
        { text: 'ขอโทษ ถ่ายไม่ได้ครับ/ค่ะ', meaning: 'Sorry, no photos' },
      ],
      vi: [
        { text: 'Được ạ', meaning: 'Yes, you can' },
        { text: 'Xin lỗi, không được chụp ạ', meaning: 'Sorry, no photos' },
      ],
      en: [
        { text: 'Sure, go ahead', meaning: 'Sure, go ahead' },
        { text: 'Sorry, we prefer no photos', meaning: 'Sorry, we prefer no photos' },
      ],
    },
  },
  {
    key: 'speak_english',
    category: 'other',
    ko: '영어 하시나요?',
    translations: {
      ja: { text: '英語は話せますか？', pronunciation: 'Eigo wa hanasemasu ka?' },
      zh: { text: '你会说英语吗？', pronunciation: 'Ni hui shuo yingyu ma?' },
      th: { text: 'พูดภาษาอังกฤษได้ไหมครับ/ค่ะ', pronunciation: 'Phuut phasa angkrit dai mai khrap/kha' },
      vi: { text: 'Bạn nói tiếng Anh được không?', pronunciation: 'Ban noy tieng Anh duoc khong?' },
      en: { text: 'Do you speak English?', pronunciation: 'Do you speak English?' },
      es: { text: '¿Habla inglés?', pronunciation: 'Ah-blah een-glehs?' },
      fr: { text: 'Parlez-vous anglais ?', pronunciation: 'Par-lay voo ahn-gleh?' },
      it: { text: 'Parla inglese?', pronunciation: 'Par-lah een-gleh-zeh?' },
    },
    expectedResponses: {
      ja: [
        { text: '少しだけ', meaning: 'Just a little' },
        { text: '英語のスタッフを呼びます', meaning: 'I will call an English-speaking staff' },
      ],
      zh: [
        { text: '会一点点', meaning: 'Just a little' },
        { text: '我叫会说英语的人来', meaning: 'I will get someone who speaks English' },
      ],
      th: [
        { text: 'นิดหน่อยครับ/ค่ะ', meaning: 'A little bit' },
        { text: 'เดี๋ยวเรียกคนพูดอังกฤษมาให้', meaning: 'I will get someone who speaks English' },
      ],
      vi: [
        { text: 'Một chút thôi', meaning: 'Just a little' },
        { text: 'Để tôi gọi người nói tiếng Anh', meaning: 'Let me get someone who speaks English' },
      ],
      en: [
        { text: 'Yes, I do', meaning: 'Yes, I do' },
        { text: 'A little', meaning: 'A little' },
      ],
    },
  },
  {
    key: 'wifi_password',
    category: 'other',
    ko: '와이파이 비밀번호가 뭔가요?',
    translations: {
      ja: { text: 'Wi-Fiのパスワードは何ですか？', pronunciation: 'Waifai no pasuwaado wa nan desu ka?' },
      zh: { text: 'WiFi密码是多少？', pronunciation: 'WiFi mima shi duoshao?' },
      th: { text: 'รหัส WiFi คืออะไรครับ/ค่ะ', pronunciation: 'Rahat WiFi kue arai khrap/kha' },
      vi: { text: 'Mật khẩu WiFi là gì?', pronunciation: 'Mat khau WiFi la gi?' },
      en: { text: 'What\'s the WiFi password?', pronunciation: 'What\'s the WiFi password?' },
      es: { text: '¿Cuál es la contraseña del WiFi?', pronunciation: 'Kwahl es lah kon-trah-seh-nyah del WiFi?' },
      fr: { text: 'Quel est le mot de passe WiFi ?', pronunciation: 'Kel eh luh moh duh pass WiFi?' },
      it: { text: 'Qual è la password del WiFi?', pronunciation: 'Kwahl eh lah password del WiFi?' },
    },
  },
  {
    key: 'how_to_eat_this',
    category: 'other',
    ko: '이거 어떻게 먹나요?',
    translations: {
      ja: { text: 'これはどうやって食べますか？', pronunciation: 'Kore wa dou yatte tabemasu ka?' },
      zh: { text: '这个怎么吃？', pronunciation: 'Zhege zenme chi?' },
      th: { text: 'อันนี้กินยังไงครับ/ค่ะ', pronunciation: 'An nii kin yang ngai khrap/kha' },
      vi: { text: 'Món này ăn như thế nào?', pronunciation: 'Mon nay an nhu the nao?' },
      en: { text: 'How do I eat this?', pronunciation: 'How do I eat this?' },
      es: { text: '¿Cómo se come esto?', pronunciation: 'Koh-moh seh koh-meh es-toh?' },
      fr: { text: 'Comment mange-t-on ceci ?', pronunciation: 'Koh-mahn mahnzh-ton suh-see?' },
      it: { text: 'Come si mangia questo?', pronunciation: 'Koh-meh see mahn-jah kwes-toh?' },
    },
    expectedResponses: {
      ja: [
        { text: '手で食べてください', meaning: 'Eat with your hands' },
        { text: 'お箸で食べてください', meaning: 'Use chopsticks' },
      ],
      zh: [
        { text: '用手吃就好', meaning: 'Just eat with your hands' },
        { text: '用筷子夹着吃', meaning: 'Use chopsticks' },
      ],
      th: [
        { text: 'ใช้มือได้เลยครับ/ค่ะ', meaning: 'Use your hands' },
        { text: 'ใช้ช้อนส้อมครับ/ค่ะ', meaning: 'Use spoon and fork' },
      ],
      vi: [
        { text: 'Dùng tay ăn được ạ', meaning: 'Use your hands' },
        { text: 'Dùng đũa ạ', meaning: 'Use chopsticks' },
      ],
      en: [
        { text: 'With your hands is fine', meaning: 'With your hands is fine' },
        { text: 'Use the chopsticks like this', meaning: 'Use the chopsticks like this' },
      ],
    },
  },
];
