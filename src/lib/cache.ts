import { getRedis } from '@/lib/redis';
import { createHash } from 'crypto';


// Bump to invalidate every cached analysis when key semantics change.
// v2: text keys keep all scripts (v1 stripped Thai, Arabic, Cyrillic, etc.).
const CACHE_KEY_VERSION = 'v2';

// Whitespace and Unicode-form changes don't alter a menu; everything else does.
function normalizeMenuText(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Build cache key
export function buildCacheKey(params: {
  input: string;
  inputType: 'image' | 'url' | 'text';
  srcLang: string;
  tgtLang: string;
  // Results flag allergens and diet conflicts per user, so these must be part of the key.
  allergenPreset?: string[];
  dietaryBeliefs?: string[];
  dislikedIngredients?: string[];
}): string {
  const normalized = params.inputType === 'text'
    ? normalizeMenuText(params.input)
    : params.input;
  const profile = [params.allergenPreset, params.dietaryBeliefs, params.dislikedIngredients]
    .map((list) => [...(list ?? [])].map((s) => s.trim().toLowerCase()).sort().join(','))
    .join('|');
  return createHash('sha256')
    .update(`${CACHE_KEY_VERSION}:${params.inputType}:${normalized}:${params.srcLang}:${params.tgtLang}:${profile}`)
    .digest('hex');
}

// Get from cache
export async function getCached(key: string): Promise<object | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const data = await r.get(key);
    if (data) {
      // Increment hit count
      await r.zincrby('popular:global', 1, key);
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
    return null;
  } catch {
    return null;
  }
}

// Set to cache (TTL 30 days)
export async function setCache(key: string, value: object, country?: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.setex(key, 30 * 24 * 60 * 60, JSON.stringify(value));
    // Track popularity
    await r.zincrby('popular:global', 1, key);
    if (country) {
      await r.zincrby(`popular:${country}`, 1, key);
    }
  } catch {
    // Cache write failure is non-fatal
  }
}

// Get popular dishes
export async function getPopularDishes(country?: string, limit = 20): Promise<string[]> {
  const r = getRedis();
  if (!r) return [];
  try {
    const key = country ? `popular:${country}` : 'popular:global';
    return await r.zrange(key, 0, limit - 1, { rev: true }) as string[];
  } catch {
    return [];
  }
}
