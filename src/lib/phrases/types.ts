export interface Phrase {
  key: string;
  category: 'basic' | 'order' | 'payment' | 'complaint' | 'greeting' | 'other';
  ko: string;
  translations: Record<string, { text: string; pronunciation: string }>;
  expectedResponses?: Record<string, Array<{ text: string; meaning: string }>>;
}

export type PhraseCategory = Phrase['category'];
