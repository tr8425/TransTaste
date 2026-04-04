import type { Phrase } from '../types';

export const ORDER_PHRASES: Phrase[] = [
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
      es: [
        { text: 'Le recomiendo esto', meaning: 'I recommend this' },
        { text: 'Nuestro plato estrella es...', meaning: 'Our star dish is...' },
      ],
      fr: [
        { text: 'Je vous conseille ceci', meaning: 'I recommend this' },
        { text: 'Notre spécialité, c\'est...', meaning: 'Our specialty is...' },
      ],
      it: [
        { text: 'Le consiglio questo', meaning: 'I recommend this' },
        { text: 'Il nostro piatto forte è...', meaning: 'Our star dish is...' },
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
      es: [
        { text: 'Sí, pica bastante', meaning: 'Yes, it is quite spicy' },
        { text: 'No pica nada', meaning: 'Not spicy at all' },
      ],
      fr: [
        { text: 'Oui, c\'est assez épicé', meaning: 'Yes, it is quite spicy' },
        { text: 'Non, pas du tout', meaning: 'No, not at all' },
      ],
      it: [
        { text: 'Sì, è abbastanza piccante', meaning: 'Yes, it is quite spicy' },
        { text: 'No, per niente', meaning: 'No, not at all' },
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
      es: [
        { text: '¿A qué es alérgico?', meaning: 'What are you allergic to?' },
        { text: 'Contiene frutos secos/lácteos/gluten', meaning: 'It contains nuts/dairy/gluten' },
      ],
      fr: [
        { text: 'Vous êtes allergique à quoi ?', meaning: 'What are you allergic to?' },
        { text: 'Ça contient des noix/produits laitiers/gluten', meaning: 'It contains nuts/dairy/gluten' },
      ],
      it: [
        { text: 'A cosa è allergico?', meaning: 'What are you allergic to?' },
        { text: 'Contiene frutta secca/latticini/glutine', meaning: 'It contains nuts/dairy/gluten' },
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
      es: [
        { text: 'Claro, sin problema', meaning: 'Sure, no problem' },
        { text: 'Lo siento, es parte del plato', meaning: 'Sorry, that is part of the dish' },
      ],
      fr: [
        { text: 'Bien sûr, pas de souci', meaning: 'Sure, no problem' },
        { text: 'Désolé, ça fait partie du plat', meaning: 'Sorry, that is part of the dish' },
      ],
      it: [
        { text: 'Certo, nessun problema', meaning: 'Sure, no problem' },
        { text: 'Mi dispiace, fa parte del piatto', meaning: 'Sorry, that is part of the dish' },
      ],
    },
  },
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
      es: [
        { text: 'Sí, es halal', meaning: 'Yes, it is halal' },
        { text: 'No, lleva cerdo', meaning: 'No, it contains pork' },
      ],
      fr: [
        { text: 'Oui, c\'est halal', meaning: 'Yes, it is halal' },
        { text: 'Non, il y a du porc', meaning: 'No, there is pork' },
      ],
      it: [
        { text: 'Sì, è halal', meaning: 'Yes, it is halal' },
        { text: 'No, contiene maiale', meaning: 'No, it contains pork' },
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
      es: [
        { text: 'Sí, le enseño', meaning: 'Yes, let me show you' },
        { text: 'Lo siento, no tenemos opciones vegetarianas', meaning: 'Sorry, we don\'t have vegetarian options' },
      ],
      fr: [
        { text: 'Oui, je vous montre', meaning: 'Yes, let me show you' },
        { text: 'Désolé, on n\'a pas d\'options végétariennes', meaning: 'Sorry, we don\'t have vegetarian options' },
      ],
      it: [
        { text: 'Sì, le faccio vedere', meaning: 'Yes, let me show you' },
        { text: 'Mi dispiace, non abbiamo opzioni vegetariane', meaning: 'Sorry, we don\'t have vegetarian options' },
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
      es: [
        { text: 'Unos 10 minutos', meaning: 'About 10 minutes' },
        { text: 'Sale enseguida', meaning: 'It will be right out' },
      ],
      fr: [
        { text: 'Environ 10 minutes', meaning: 'About 10 minutes' },
        { text: 'Ça arrive tout de suite', meaning: 'It is coming right away' },
      ],
      it: [
        { text: 'Circa 10 minuti', meaning: 'About 10 minutes' },
        { text: 'Arriva subito', meaning: 'It is coming right away' },
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
];
