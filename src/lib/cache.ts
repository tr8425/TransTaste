import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

// Lazy init — returns null if env vars not set
let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return redis;
}

// Normalize dish name for fuzzy matching (L2 cache)
function normalizeDishName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w\u3040-\u9fff\uAC00-\uD7A3]/g, '')
    .trim();
}

// Build cache key
export function buildCacheKey(params: {
  input: string;
  inputType: 'image' | 'url' | 'text';
  srcLang: string;
  tgtLang: string;
}): string {
  const normalized = params.inputType === 'text'
    ? normalizeDishName(params.input)
    : params.input;
  return createHash('sha256')
    .update(`${params.inputType}:${normalized}:${params.srcLang}:${params.tgtLang}`)
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
