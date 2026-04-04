export type { Phrase, PhraseCategory } from './types';
export { PHRASE_CATEGORIES } from './categories';

import { BASIC_PHRASES } from './data/basic';
import { ORDER_PHRASES } from './data/order';
import { PAYMENT_PHRASES } from './data/payment';
import { COMPLAINT_PHRASES } from './data/complaint';
import { GREETING_PHRASES } from './data/greeting';
import { OTHER_PHRASES } from './data/other';

export {
  BASIC_PHRASES,
  ORDER_PHRASES,
  PAYMENT_PHRASES,
  COMPLAINT_PHRASES,
  GREETING_PHRASES,
  OTHER_PHRASES,
};

export const PHRASES = [
  ...BASIC_PHRASES,
  ...ORDER_PHRASES,
  ...PAYMENT_PHRASES,
  ...COMPLAINT_PHRASES,
  ...GREETING_PHRASES,
  ...OTHER_PHRASES,
];
