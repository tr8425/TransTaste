import type { Phrase } from '../types';

export const OTHER_PHRASES: Phrase[] = [
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
      es: [
        { text: 'Por aquí, por favor', meaning: 'This way, please' },
        { text: 'Hay unos ___ minutos de espera', meaning: 'There is about a ___ minute wait' },
      ],
      fr: [
        { text: 'Par ici, s\'il vous plaît', meaning: 'This way, please' },
        { text: 'Il y a environ ___ minutes d\'attente', meaning: 'There is about a ___ minute wait' },
      ],
      it: [
        { text: 'Da questa parte, prego', meaning: 'This way, please' },
        { text: 'C\'è un\'attesa di circa ___ minuti', meaning: 'There is about a ___ minute wait' },
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
      es: [
        { text: '¿A nombre de quién?', meaning: 'Under what name?' },
      ],
      fr: [
        { text: 'À quel nom ?', meaning: 'Under what name?' },
      ],
      it: [
        { text: 'A che nome?', meaning: 'Under what name?' },
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
      es: [
        { text: 'Al fondo a la derecha', meaning: 'At the back on the right' },
      ],
      fr: [
        { text: 'Au fond à droite', meaning: 'At the back on the right' },
      ],
      it: [
        { text: 'In fondo a destra', meaning: 'At the back on the right' },
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
      es: [
        { text: 'Claro, sígame', meaning: 'Sure, follow me' },
        { text: 'Lo siento, la terraza está llena', meaning: 'Sorry, the terrace is full' },
      ],
      fr: [
        { text: 'Bien sûr, suivez-moi', meaning: 'Sure, follow me' },
        { text: 'Désolé, la terrasse est pleine', meaning: 'Sorry, the terrace is full' },
      ],
      it: [
        { text: 'Certo, mi segua', meaning: 'Sure, follow me' },
        { text: 'Mi dispiace, fuori è tutto pieno', meaning: 'Sorry, outside is all full' },
      ],
    },
  },
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
      es: [
        { text: 'Claro, adelante', meaning: 'Sure, go ahead' },
        { text: 'Lo siento, preferimos que no se tomen fotos', meaning: 'Sorry, we prefer no photos' },
      ],
      fr: [
        { text: 'Bien sûr, allez-y', meaning: 'Sure, go ahead' },
        { text: 'Désolé, les photos ne sont pas autorisées', meaning: 'Sorry, photos are not allowed' },
      ],
      it: [
        { text: 'Certo, faccia pure', meaning: 'Sure, go ahead' },
        { text: 'Mi dispiace, preferiamo niente foto', meaning: 'Sorry, we prefer no photos' },
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
      es: [
        { text: 'Un poquito', meaning: 'A little bit' },
        { text: 'Voy a llamar a alguien que hable inglés', meaning: 'I will call someone who speaks English' },
      ],
      fr: [
        { text: 'Un petit peu', meaning: 'A little bit' },
        { text: 'Je vais chercher quelqu\'un qui parle anglais', meaning: 'I will get someone who speaks English' },
      ],
      it: [
        { text: 'Un pochino', meaning: 'A little bit' },
        { text: 'Chiamo qualcuno che parla inglese', meaning: 'I will call someone who speaks English' },
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
      es: [
        { text: 'Con las manos, sin problema', meaning: 'With your hands, no problem' },
        { text: 'Se come así, mire', meaning: 'You eat it like this, look' },
      ],
      fr: [
        { text: 'Avec les mains, c\'est très bien', meaning: 'With your hands is fine' },
        { text: 'Comme ça, regardez', meaning: 'Like this, look' },
      ],
      it: [
        { text: 'Con le mani va benissimo', meaning: 'With your hands is perfectly fine' },
        { text: 'Si mangia così, guardi', meaning: 'You eat it like this, look' },
      ],
    },
  },
];
