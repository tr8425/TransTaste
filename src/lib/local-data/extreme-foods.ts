export interface ExtremeFood {
  name: string;
  country: string;
  warning_level: 'extreme' | 'moderate' | 'note';
  description: string;
}

export const EXTREME_FOODS: Record<string, ExtremeFood> = {
  '홍어': { name: '홍어', country: 'KR', warning_level: 'extreme', description: 'Fermented skate with a strong ammonia aroma. An acquired taste even for locals.' },
  '낫토': { name: '낫토', country: 'JP', warning_level: 'moderate', description: 'Fermented soybeans with sticky texture and distinctive smell.' },
  '두리안': { name: '두리안', country: 'TH/MY', warning_level: 'extreme', description: 'Extremely pungent tropical fruit. Banned in many indoor spaces.' },
  '순대': { name: '순대', country: 'KR', warning_level: 'note', description: 'Blood sausage made with pig intestines. Not halal.' },
  '곱창': { name: '곱창', country: 'KR', warning_level: 'note', description: 'Grilled intestines. Rich flavor, unique chewy texture.' },
  '번데기': { name: '번데기', country: 'KR', warning_level: 'moderate', description: 'Steamed silkworm pupae. Common Korean street snack.' },
  '피단': { name: '피단', country: 'CN', warning_level: 'moderate', description: 'Century egg. Strong sulfur aroma, creamy dark yolk.' },
  '취두부': { name: '취두부', country: 'CN/TW', warning_level: 'extreme', description: 'Stinky tofu. Fermented tofu with an intense smell, but beloved flavor.' },
  '발루트': { name: '발루트', country: 'PH', warning_level: 'extreme', description: 'Fertilized duck egg with partially developed embryo.' },
  '하카를': { name: '하카를', country: 'IS', warning_level: 'extreme', description: 'Fermented shark. Iceland\'s traditional delicacy with strong ammonia taste.' },
  '수르스트뢰밍': { name: '수르스트뢰밍', country: 'SE', warning_level: 'extreme', description: 'Fermented Baltic herring. Intensely pungent, usually opened outdoors.' },
  '키비악': { name: '키비악', country: 'GL', warning_level: 'extreme', description: 'Fermented seabirds stuffed inside a seal skin and buried for months.' },
  '쿠이': { name: '쿠이', country: 'PE', warning_level: 'moderate', description: 'Roasted guinea pig. A traditional Andean delicacy served whole.' },
  '에스카르고': { name: '에스카르고', country: 'FR', warning_level: 'note', description: 'Snails cooked in garlic butter. A classic French appetizer.' },
  '하기스': { name: '하기스', country: 'GB-SCT', warning_level: 'note', description: 'Savory pudding of sheep organs cooked in a sheep stomach.' },
  '산낙지': { name: '산낙지', country: 'KR', warning_level: 'moderate', description: 'Live octopus served freshly cut. Tentacles still move on the plate.' },
  '베지마이트': { name: '베지마이트', country: 'AU', warning_level: 'note', description: 'Thick yeast extract spread. Extremely salty and savory, spread thinly on toast.' },
  '카수마르주': { name: '카수마르주', country: 'IT', warning_level: 'extreme', description: 'Sardinian cheese containing live insect larvae. Banned but still produced locally.' },
  '앙주': { name: '앙주', country: 'KH', warning_level: 'moderate', description: 'Deep-fried tarantula. Crispy outside, soft inside. A popular Cambodian snack.' },
  '쏨팍': { name: '쏨팍', country: 'TH', warning_level: 'note', description: 'Fermented fish paste used as a base in Thai cooking. Very pungent aroma.' },
  '루테피스크': { name: '루테피스크', country: 'NO', warning_level: 'moderate', description: 'Dried whitefish treated with lye. Gelatinous texture, mild but polarizing.' },
  '째오': { name: '째오', country: 'VN', warning_level: 'note', description: 'Fermented fish sauce condiment. Strong umami flavor, essential in Vietnamese cuisine.' },
  '이나고': { name: '이나고', country: 'JP', warning_level: 'note', description: 'Grasshoppers simmered in soy sauce and sugar (tsukudani). A traditional Japanese snack.' },
  '풋코': { name: '풋코', country: 'IS', warning_level: 'extreme', description: 'Sour ram testicles pressed and cured. A traditional Icelandic Thorrablot dish.' },
  '차파룰리네스': { name: '차파룰리네스', country: 'MX', warning_level: 'moderate', description: 'Toasted grasshoppers seasoned with chili and lime. A popular Oaxacan snack.' },
};
