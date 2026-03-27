export interface SpicyScale {
  country: string;
  countryCode: string;
  local_max_note: string;
  global_equiv: number; // 1-10 global absolute scale
  comparison: string;
}

export const SPICY_SCALES: Record<string, SpicyScale> = {
  'KR': { country: 'Korea', countryCode: 'KR', local_max_note: 'Buldak (fire chicken) level', global_equiv: 7, comparison: 'Moderate-high. Most dishes are manageable.' },
  'TH': { country: 'Thailand', countryCode: 'TH', local_max_note: 'Thai spicy is globally extreme', global_equiv: 9, comparison: 'Very high. "Medium" here may be "hot" elsewhere.' },
  'IN': { country: 'India', countryCode: 'IN', local_max_note: 'Phaal curry level', global_equiv: 10, comparison: 'Highest globally. Always specify your tolerance.' },
  'JP': { country: 'Japan', countryCode: 'JP', local_max_note: 'Generally mild cuisine', global_equiv: 3, comparison: 'Low. Even "spicy" dishes are usually mild.' },
  'CN': { country: 'China', countryCode: 'CN', local_max_note: 'Sichuan mala can be extreme', global_equiv: 8, comparison: 'High in Sichuan/Hunan. Mild in Cantonese.' },
  'MX': { country: 'Mexico', countryCode: 'MX', local_max_note: 'Habanero-based salsas', global_equiv: 8, comparison: 'High. Salsas range widely — always ask.' },
  'VN': { country: 'Vietnam', countryCode: 'VN', local_max_note: 'Moderate with fresh chilies', global_equiv: 5, comparison: 'Moderate. Chili is often served on the side.' },
  'US': { country: 'USA', countryCode: 'US', local_max_note: 'Varies by cuisine type', global_equiv: 4, comparison: 'Low-moderate. Spice is usually adjustable.' },
  'FR': { country: 'France', countryCode: 'FR', local_max_note: 'Rarely spicy', global_equiv: 2, comparison: 'Very low. French cuisine focuses on herbs, not heat.' },
  'IT': { country: 'Italy', countryCode: 'IT', local_max_note: 'Calabrian peperoncino', global_equiv: 4, comparison: 'Low-moderate. Southern Italy uses more chili.' },
  'ID': { country: 'Indonesia', countryCode: 'ID', local_max_note: 'Sambal-based heat in most dishes', global_equiv: 7, comparison: 'Moderate-high. Sambal varieties range from mild to fiery.' },
  'MY': { country: 'Malaysia', countryCode: 'MY', local_max_note: 'Laksa and sambal staples', global_equiv: 6, comparison: 'Moderate-high. Laksa and sambal add consistent heat.' },
  'SG': { country: 'Singapore', countryCode: 'SG', local_max_note: 'Moderate with chili sauces on the side', global_equiv: 5, comparison: 'Moderate. Chili sauce is ubiquitous but often optional.' },
  'PH': { country: 'Philippines', countryCode: 'PH', local_max_note: 'Mild with vinegar and soy focus', global_equiv: 4, comparison: 'Low-moderate. Cuisine favors sour and savory over heat.' },
  'TR': { country: 'Turkey', countryCode: 'TR', local_max_note: 'Antep pepper and pul biber', global_equiv: 5, comparison: 'Moderate. Southeastern regions use more chili.' },
  'KH': { country: 'Cambodia', countryCode: 'KH', local_max_note: 'Mild with fresh herbs and aromatics', global_equiv: 4, comparison: 'Low-moderate. Khmer cuisine relies on herbs over chili.' },
  'ES': { country: 'Spain', countryCode: 'ES', local_max_note: 'Pimientos de padrón', global_equiv: 3, comparison: 'Low. Most dishes are not spicy; occasional mild peppers.' },
  'ET': { country: 'Ethiopia', countryCode: 'ET', local_max_note: 'Berbere spice blend in stews', global_equiv: 7, comparison: 'Moderate-high. Berbere and mitmita bring significant heat.' },
  'PE': { country: 'Peru', countryCode: 'PE', local_max_note: 'Aji peppers in sauces and ceviches', global_equiv: 6, comparison: 'Moderate-high. Aji amarillo and rocoto are widely used.' },
  'NG': { country: 'Nigeria', countryCode: 'NG', local_max_note: 'Scotch bonnet peppers in soups and stews', global_equiv: 7, comparison: 'Moderate-high. Scotch bonnets bring intense heat to many dishes.' },
};
