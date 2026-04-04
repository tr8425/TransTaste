import type { Phrase } from '../types';

export const PAYMENT_PHRASES: Phrase[] = [
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
      es: [
        { text: 'Son ___ euros en total', meaning: 'That is ___ euros total' },
        { text: 'Ahora se la traigo', meaning: 'I will bring it right over' },
      ],
      fr: [
        { text: 'Ça fait ___ euros', meaning: 'That is ___ euros' },
        { text: 'Je vous apporte ça', meaning: 'I will bring that over' },
      ],
      it: [
        { text: 'Sono ___ euro in tutto', meaning: 'That is ___ euros total' },
        { text: 'Glielo porto subito', meaning: 'I will bring it right away' },
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
      es: [
        { text: 'Sí, aceptamos tarjeta', meaning: 'Yes, we accept cards' },
        { text: 'Lo siento, solo efectivo', meaning: 'Sorry, cash only' },
      ],
      fr: [
        { text: 'Oui, on prend la carte', meaning: 'Yes, we take cards' },
        { text: 'Désolé, uniquement en espèces', meaning: 'Sorry, cash only' },
      ],
      it: [
        { text: 'Sì, accettiamo carte', meaning: 'Yes, we accept cards' },
        { text: 'Mi dispiace, solo contanti', meaning: 'Sorry, cash only' },
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
      es: [
        { text: 'Claro, sin problema', meaning: 'Sure, no problem' },
        { text: 'Lo siento, solo podemos hacer una cuenta', meaning: 'Sorry, we can only do one check' },
      ],
      fr: [
        { text: 'Bien sûr, pas de souci', meaning: 'Sure, no problem' },
        { text: 'Désolé, on ne peut pas séparer', meaning: 'Sorry, we cannot split' },
      ],
      it: [
        { text: 'Certo, nessun problema', meaning: 'Sure, no problem' },
        { text: 'Mi dispiace, facciamo solo un conto unico', meaning: 'Sorry, we only do one bill' },
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
      es: [
        { text: 'Sí, los precios incluyen impuestos', meaning: 'Yes, prices include tax' },
        { text: 'No, el impuesto se añade aparte', meaning: 'No, tax is added separately' },
      ],
      fr: [
        { text: 'Oui, c\'est TTC', meaning: 'Yes, tax is included' },
        { text: 'Non, la taxe est en sus', meaning: 'No, tax is extra' },
      ],
      it: [
        { text: 'Sì, i prezzi sono tasse incluse', meaning: 'Yes, prices include tax' },
        { text: 'No, le tasse vanno aggiunte', meaning: 'No, taxes will be added' },
      ],
    },
  },
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
      es: [
        { text: 'Sí, el servicio está incluido', meaning: 'Yes, service is included' },
        { text: 'No, la propina es aparte', meaning: 'No, the tip is separate' },
      ],
      fr: [
        { text: 'Oui, le service est compris', meaning: 'Yes, service is included' },
        { text: 'Non, le pourboire est en plus', meaning: 'No, the tip is extra' },
      ],
      it: [
        { text: 'Sì, il servizio è incluso', meaning: 'Yes, service is included' },
        { text: 'No, la mancia è a parte', meaning: 'No, the tip is separate' },
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
];
