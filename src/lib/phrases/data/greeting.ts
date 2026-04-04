import type { Phrase } from '../types';

export const GREETING_PHRASES: Phrase[] = [
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
      es: [
        { text: '¡Que aproveche!', meaning: 'Enjoy your meal!' },
      ],
      fr: [
        { text: 'Bon appétit !', meaning: 'Enjoy your meal!' },
      ],
      it: [
        { text: 'Buon appetito!', meaning: 'Enjoy your meal!' },
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
      es: [
        { text: '¡Gracias! Me alegro de que le guste', meaning: 'Thanks! Glad you like it' },
      ],
      fr: [
        { text: 'Merci, ça fait plaisir !', meaning: 'Thanks, that makes us happy!' },
      ],
      it: [
        { text: 'Grazie, mi fa piacere!', meaning: 'Thanks, I am glad!' },
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
      es: [
        { text: '¡Se lo diré al chef, gracias!', meaning: 'I will tell the chef, thanks!' },
      ],
      fr: [
        { text: 'Je transmettrai au chef, merci !', meaning: 'I will pass it on to the chef, thanks!' },
      ],
      it: [
        { text: 'Lo dirò allo chef, grazie!', meaning: 'I will tell the chef, thanks!' },
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
      es: [
        { text: '¡Gracias, vuelva pronto!', meaning: 'Thanks, come back soon!' },
      ],
      fr: [
        { text: 'Merci, à bientôt !', meaning: 'Thanks, see you soon!' },
      ],
      it: [
        { text: 'Grazie, torni presto!', meaning: 'Thanks, come back soon!' },
      ],
    },
  },
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
];
