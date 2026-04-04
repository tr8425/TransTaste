import type { Phrase } from '../types';

export const COMPLAINT_PHRASES: Phrase[] = [
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
      es: [
        { text: 'Lo siento mucho, se lo cambio ahora mismo', meaning: 'So sorry, I will replace it right now' },
      ],
      fr: [
        { text: 'Je suis vraiment désolé, je vous change ça tout de suite', meaning: 'I am really sorry, I will replace it right away' },
      ],
      it: [
        { text: 'Mi scusi tanto, glielo cambio subito', meaning: 'So sorry, I will replace it right away' },
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
      es: [
        { text: 'Perdone, déjeme revisar su pedido', meaning: 'Sorry, let me check your order' },
      ],
      fr: [
        { text: 'Pardon, laissez-moi vérifier votre commande', meaning: 'Sorry, let me check your order' },
      ],
      it: [
        { text: 'Mi scusi, controllo il suo ordine', meaning: 'Sorry, let me check your order' },
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
      es: [
        { text: 'Perdone, lo volvemos a cocinar', meaning: 'Sorry, we will cook it again' },
      ],
      fr: [
        { text: 'Désolé, on va le recuire', meaning: 'Sorry, we will cook it more' },
      ],
      it: [
        { text: 'Mi scusi, lo facciamo cuocere di più', meaning: 'Sorry, we will cook it more' },
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
      es: [
        { text: 'Claro, ¿qué prefiere?', meaning: 'Sure, what would you prefer?' },
        { text: 'Lo siento, ya se está preparando', meaning: 'Sorry, it is already being prepared' },
      ],
      fr: [
        { text: 'Bien sûr, que souhaitez-vous à la place ?', meaning: 'Sure, what would you like instead?' },
        { text: 'Désolé, c\'est déjà en préparation', meaning: 'Sorry, it is already being prepared' },
      ],
      it: [
        { text: 'Certo, cosa preferisce?', meaning: 'Sure, what would you prefer?' },
        { text: 'Mi dispiace, è già in preparazione', meaning: 'Sorry, it is already being prepared' },
      ],
    },
  },
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
];
