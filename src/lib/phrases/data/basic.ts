import type { Phrase } from '../types';

export const BASIC_PHRASES: Phrase[] = [
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
      es: [
        { text: 'Claro, un momento', meaning: 'Sure, one moment' },
        { text: '¿Con gas o sin gas?', meaning: 'Sparkling or still?' },
      ],
      fr: [
        { text: 'Bien sûr, un instant', meaning: 'Of course, one moment' },
        { text: 'Plate ou gazeuse ?', meaning: 'Still or sparkling?' },
      ],
      it: [
        { text: 'Certo, un momento', meaning: 'Sure, one moment' },
        { text: 'Naturale o frizzante?', meaning: 'Still or sparkling?' },
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
      es: [
        { text: 'Claro, ¿cuáles quiere?', meaning: 'Sure, which ones do you want?' },
        { text: 'Enseguida se los traigo', meaning: 'I will bring them right away' },
      ],
      fr: [
        { text: 'Bien sûr, lesquels ?', meaning: 'Sure, which ones?' },
        { text: 'Tout de suite', meaning: 'Right away' },
      ],
      it: [
        { text: 'Certo, quali desidera?', meaning: 'Sure, which ones would you like?' },
        { text: 'Arrivo subito', meaning: 'Coming right away' },
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
      es: [
        { text: 'Claro, ahora mismo', meaning: 'Sure, right away' },
      ],
      fr: [
        { text: 'Bien sûr, tout de suite', meaning: 'Of course, right away' },
      ],
      it: [
        { text: 'Certo, subito', meaning: 'Sure, right away' },
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
      es: [
        { text: '¿Para aquí o para llevar?', meaning: 'For here or to go?' },
        { text: 'Se lo preparo enseguida', meaning: 'I will prepare it right away' },
      ],
      fr: [
        { text: 'Sur place ou à emporter ?', meaning: 'For here or to go?' },
        { text: 'Je vous prépare ça', meaning: 'I will prepare that for you' },
      ],
      it: [
        { text: 'Da mangiare qui o da asporto?', meaning: 'For here or to go?' },
        { text: 'Glielo preparo subito', meaning: 'I will prepare it right away' },
      ],
    },
  },
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
      es: [
        { text: 'Sí, aquí tiene', meaning: 'Yes, here you go' },
        { text: 'Lo siento, solo tenemos el menú en el idioma local', meaning: 'Sorry, we only have the local language menu' },
      ],
      fr: [
        { text: 'Oui, voilà', meaning: 'Yes, here you go' },
        { text: 'Désolé, on n\'a que le menu en français', meaning: 'Sorry, we only have the French menu' },
      ],
      it: [
        { text: 'Sì, ecco a lei', meaning: 'Yes, here you go' },
        { text: 'Mi dispiace, abbiamo solo il menu in italiano', meaning: 'Sorry, we only have the Italian menu' },
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
];
