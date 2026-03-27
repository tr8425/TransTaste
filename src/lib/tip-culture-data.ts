export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  tip: {
    type: 'none' | 'optional' | 'expected';
    range_min: number;
    range_max: number;
    note: string;
  };
  culture: {
    water: 'free' | 'paid' | 'self';
    side_dishes: boolean;
    payment_location: 'table' | 'counter' | 'either';
    tax_included: boolean;
    notes: string[];
  };
  dining: {
    primary_utensil: 'chopsticks' | 'fork_spoon' | 'hands' | 'mixed';
    utensil_tip: string;
    lunch_hours: string;
    dinner_hours: string;
    time_note: string;
  };
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: 'JP',
    name: 'Japan',
    flag: '\u{1F1EF}\u{1F1F5}',
    tip: {
      type: 'none',
      range_min: 0,
      range_max: 0,
      note: 'Tipping is considered rude in Japan. Excellent service is the standard.',
    },
    culture: {
      water: 'free',
      side_dishes: false,
      payment_location: 'counter',
      tax_included: false,
      notes: [
        'Say "itadakimasu" before eating and "gochisousama" after',
        'Slurping noodles is polite and shows you enjoy the food',
        'Do not stick chopsticks upright in rice — it resembles a funeral ritual',
        'Many restaurants have ticket vending machines at the entrance',
      ],
    },
    dining: {
      primary_utensil: 'chopsticks',
      utensil_tip: 'Use chopsticks for most dishes. A spoon is provided for soups and donburi.',
      lunch_hours: '11:30-14:00',
      dinner_hours: '18:00-22:00',
      time_note: 'Last order is usually 30 minutes before closing.',
    },
  },
  {
    code: 'KR',
    name: 'Korea',
    flag: '\u{1F1F0}\u{1F1F7}',
    tip: {
      type: 'none',
      range_min: 0,
      range_max: 0,
      note: 'Tipping is not customary in South Korea. Service charge may be added at upscale restaurants.',
    },
    culture: {
      water: 'self',
      side_dishes: true,
      payment_location: 'counter',
      tax_included: true,
      notes: [
        'Free side dishes (banchan) are refillable — just ask',
        'Pour drinks for others, never for yourself',
        'Use both hands when receiving or giving items to elders',
        'Water and utensils are often self-service from a dispenser',
      ],
    },
    dining: {
      primary_utensil: 'chopsticks',
      utensil_tip: 'Use metal chopsticks and a long-handled spoon. Spoon for rice and soup, chopsticks for side dishes.',
      lunch_hours: '11:30-14:00',
      dinner_hours: '17:30-21:30',
      time_note: 'Korean BBQ and fried chicken places often stay open late.',
    },
  },
  {
    code: 'CN',
    name: 'China',
    flag: '\u{1F1E8}\u{1F1F3}',
    tip: {
      type: 'none',
      range_min: 0,
      range_max: 0,
      note: 'Tipping is not expected and can cause confusion. Some high-end hotels may accept tips.',
    },
    culture: {
      water: 'free',
      side_dishes: false,
      payment_location: 'either',
      tax_included: true,
      notes: [
        'Hot tea or hot water is usually provided for free',
        'Dishes are shared family-style at the center of the table',
        'The host typically pays the entire bill — splitting is uncommon',
        'Mobile payment (WeChat Pay, Alipay) is dominant; cash may not be accepted',
      ],
    },
    dining: {
      primary_utensil: 'chopsticks',
      utensil_tip: 'Chopsticks are standard. A porcelain spoon is provided for soups.',
      lunch_hours: '11:00-13:30',
      dinner_hours: '17:30-20:30',
      time_note: 'Restaurants close early compared to Western countries.',
    },
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    tip: {
      type: 'optional',
      range_min: 0,
      range_max: 10,
      note: 'Tipping is not required but appreciated. Rounding up the bill or leaving small change is common.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Street food is a major part of the food culture — safe and delicious',
        'Dishes come out as they are ready, not all at once',
        'Spiciness is serious — "mai phet" means "not spicy"',
        'Some upscale restaurants add a 10% service charge',
      ],
    },
    dining: {
      primary_utensil: 'fork_spoon',
      utensil_tip: 'Use a fork to push food onto the spoon. Chopsticks are only for noodle soups.',
      lunch_hours: '11:00-14:00',
      dinner_hours: '17:00-22:00',
      time_note: 'Street food stalls may operate late into the night.',
    },
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '\u{1F1FB}\u{1F1F3}',
    tip: {
      type: 'optional',
      range_min: 0,
      range_max: 10,
      note: 'Tipping is not expected but small tips are appreciated, especially in tourist areas.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Fresh herbs and greens are served on a side plate — add them to your dish',
        'Pho and bun are eaten with chopsticks and a spoon simultaneously',
        'Iced drinks use local ice which is generally safe in cities',
        'Street food is an essential part of Vietnamese dining',
      ],
    },
    dining: {
      primary_utensil: 'chopsticks',
      utensil_tip: 'Chopsticks and a soup spoon are standard. Use the spoon to drink broth.',
      lunch_hours: '11:00-13:30',
      dinner_hours: '18:00-21:00',
      time_note: 'Breakfast pho is a tradition — many shops open at 6:00 AM.',
    },
  },
  {
    code: 'US',
    name: 'USA',
    flag: '\u{1F1FA}\u{1F1F8}',
    tip: {
      type: 'expected',
      range_min: 15,
      range_max: 20,
      note: 'Tipping is expected at sit-down restaurants. 15-20% of the pre-tax bill is standard.',
    },
    culture: {
      water: 'free',
      side_dishes: false,
      payment_location: 'table',
      tax_included: false,
      notes: [
        'Tax is added on top of menu prices',
        'Free refills on soft drinks are common',
        'Portions are large — taking leftovers home is normal',
        'Servers rely heavily on tips as part of their income',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife are standard. Casual spots may be hands-only (burgers, pizza).',
      lunch_hours: '11:00-14:00',
      dinner_hours: '17:00-21:00',
      time_note: 'Many restaurants close kitchens by 21:00-22:00.',
    },
  },
  {
    code: 'GB',
    name: 'UK',
    flag: '\u{1F1EC}\u{1F1E7}',
    tip: {
      type: 'optional',
      range_min: 10,
      range_max: 15,
      note: 'Tipping 10-15% is appreciated but not mandatory. Check if service charge is already included.',
    },
    culture: {
      water: 'free',
      side_dishes: false,
      payment_location: 'either',
      tax_included: true,
      notes: [
        'Tap water is free by law — just ask for "tap water"',
        'A discretionary service charge (12.5%) is often added automatically',
        'Pubs may have table service or order-at-the-bar systems',
        'Queuing etiquette is taken seriously',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife. The fork is held in the left hand, knife in the right.',
      lunch_hours: '12:00-14:00',
      dinner_hours: '18:00-21:00',
      time_note: 'Sunday roast is a tradition — many pubs serve it from noon.',
    },
  },
  {
    code: 'FR',
    name: 'France',
    flag: '\u{1F1EB}\u{1F1F7}',
    tip: {
      type: 'optional',
      range_min: 5,
      range_max: 10,
      note: 'Service is included in prices by law (service compris). A small extra tip for great service is a nice gesture.',
    },
    culture: {
      water: 'free',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Ask for "une carafe d\'eau" for free tap water',
        'Bread is always served and is free — no plate needed, place it on the table',
        'Meals are a leisurely affair — do not rush',
        'Saying "bonjour" when entering is essential etiquette',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife, Continental style. Keep hands on the table (not on lap).',
      lunch_hours: '12:00-14:00',
      dinner_hours: '19:30-22:00',
      time_note: 'Restaurants strictly follow meal times. Many close between lunch and dinner.',
    },
  },
  {
    code: 'ES',
    name: 'Spain',
    flag: '\u{1F1EA}\u{1F1F8}',
    tip: {
      type: 'optional',
      range_min: 5,
      range_max: 10,
      note: 'Tipping is not expected but rounding up or leaving small change is appreciated.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Tapas culture: order multiple small dishes to share',
        'Some bars offer a free tapa with your drink',
        'Lunch is the main meal of the day',
        '"La cuenta, por favor" to ask for the bill — it won\'t come automatically',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife for meals. Tapas are often eaten with small forks or toothpicks.',
      lunch_hours: '14:00-16:00',
      dinner_hours: '21:00-23:00',
      time_note: 'Spain eats late! Dinner rarely starts before 21:00.',
    },
  },
  {
    code: 'IT',
    name: 'Italy',
    flag: '\u{1F1EE}\u{1F1F9}',
    tip: {
      type: 'optional',
      range_min: 5,
      range_max: 10,
      note: 'Tipping is not expected. A "coperto" (cover charge) of 1-3 EUR per person is common.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Coperto (cover charge) is standard and not a tip',
        'Cappuccino is a morning drink only — order espresso after meals',
        'Pasta is a first course (primo), not a main course',
        'Standing at the bar for coffee is cheaper than sitting at a table',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife. Twirl pasta with a fork only — no spoon.',
      lunch_hours: '12:30-14:30',
      dinner_hours: '19:30-22:00',
      time_note: 'Restaurants may close between lunch and dinner (15:00-19:00).',
    },
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '\u{1F1E9}\u{1F1EA}',
    tip: {
      type: 'optional',
      range_min: 5,
      range_max: 10,
      note: 'Rounding up the bill or adding 5-10% is customary. Tell the server the total you want to pay.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Tap water is not usually served — order "Leitungswasser" if you want it',
        'Sparkling water (Sprudel) is the default',
        'Separate checks are completely normal — just ask',
        'Say the amount you want to pay including tip to the server',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife, Continental style. Keep both hands on the table.',
      lunch_hours: '11:30-14:00',
      dinner_hours: '18:00-21:00',
      time_note: 'Biergartens may close earlier on weekdays.',
    },
  },
  {
    code: 'IN',
    name: 'India',
    flag: '\u{1F1EE}\u{1F1F3}',
    tip: {
      type: 'optional',
      range_min: 5,
      range_max: 10,
      note: 'Tipping 5-10% is appreciated but not mandatory. Some restaurants add a service charge.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: false,
      notes: [
        'Drink only bottled or filtered water',
        'Many restaurants are vegetarian-only — look for "Pure Veg" signs',
        'GST (tax) is added on top of menu prices',
        'Street food is popular but choose busy stalls for freshness',
      ],
    },
    dining: {
      primary_utensil: 'hands',
      utensil_tip: 'Eat with your right hand only. Spoons are available and common in restaurants.',
      lunch_hours: '12:00-15:00',
      dinner_hours: '19:00-22:00',
      time_note: 'Thali meals (set plates) are usually served during lunch hours.',
    },
  },
  {
    code: 'TR',
    name: 'Turkey',
    flag: '\u{1F1F9}\u{1F1F7}',
    tip: {
      type: 'optional',
      range_min: 5,
      range_max: 10,
      note: 'Tipping 5-10% is appreciated. Round up the bill or leave small change.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Turkish tea (cay) is often offered for free after meals',
        'Bread is served with every meal and is usually free',
        'Breakfast (kahvalti) is an elaborate spread — don\'t miss it',
        'Turkish coffee grounds at the bottom of the cup are not meant to be drunk',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife for most dishes. Kebabs in bread wraps are eaten by hand.',
      lunch_hours: '12:00-14:00',
      dinner_hours: '19:00-22:00',
      time_note: 'During Ramadan, restaurants may be less busy during the day.',
    },
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: '\u{1F1F2}\u{1F1FD}',
    tip: {
      type: 'expected',
      range_min: 10,
      range_max: 15,
      note: 'Tipping 10-15% is expected at sit-down restaurants. Street food vendors do not expect tips.',
    },
    culture: {
      water: 'paid',
      side_dishes: false,
      payment_location: 'table',
      tax_included: true,
      notes: [
        'Drink bottled water only — avoid tap water and ice in small vendors',
        'Salsa and chips/tortillas are often complimentary',
        'Lunch (comida) is the main meal, typically 14:00-16:00',
        '"La cuenta" to ask for the bill — it won\'t come unless requested',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife for plated meals. Tacos and street food are eaten by hand.',
      lunch_hours: '14:00-16:00',
      dinner_hours: '20:00-22:00',
      time_note: 'Mexicans eat late — dinner after 20:00 is normal.',
    },
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '\u{1F1E6}\u{1F1FA}',
    tip: {
      type: 'optional',
      range_min: 0,
      range_max: 10,
      note: 'Tipping is not expected due to fair wages. Rounding up for exceptional service is appreciated.',
    },
    culture: {
      water: 'free',
      side_dishes: false,
      payment_location: 'either',
      tax_included: true,
      notes: [
        'Tap water is free and safe to drink everywhere',
        'Coffee culture is serious — order a "flat white" for the local favorite',
        'BYO (Bring Your Own) restaurants let you bring wine for a corkage fee',
        'Brunch culture is huge — weekend waits at popular cafes are common',
      ],
    },
    dining: {
      primary_utensil: 'mixed',
      utensil_tip: 'Fork and knife for meals. Casual and multicultural dining is the norm.',
      lunch_hours: '12:00-14:30',
      dinner_hours: '18:00-21:00',
      time_note: 'Australians eat dinner earlier than many European countries.',
    },
  },
];

/** Map language codes from menu scan to country codes */
export const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  ja: 'JP',
  'ja-JP': 'JP',
  japanese: 'JP',
  ko: 'KR',
  'ko-KR': 'KR',
  korean: 'KR',
  zh: 'CN',
  'zh-CN': 'CN',
  'zh-TW': 'CN',
  chinese: 'CN',
  th: 'TH',
  'th-TH': 'TH',
  thai: 'TH',
  vi: 'VN',
  'vi-VN': 'VN',
  vietnamese: 'VN',
  en: 'US',
  'en-US': 'US',
  'en-GB': 'GB',
  english: 'US',
  fr: 'FR',
  'fr-FR': 'FR',
  french: 'FR',
  es: 'ES',
  'es-ES': 'ES',
  'es-MX': 'MX',
  spanish: 'ES',
  it: 'IT',
  'it-IT': 'IT',
  italian: 'IT',
  de: 'DE',
  'de-DE': 'DE',
  german: 'DE',
  hi: 'IN',
  'hi-IN': 'IN',
  hindi: 'IN',
  tr: 'TR',
  'tr-TR': 'TR',
  turkish: 'TR',
};
