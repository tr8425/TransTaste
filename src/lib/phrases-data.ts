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
];
