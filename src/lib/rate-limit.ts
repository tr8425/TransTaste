import { Redis } from '@upstash/redis';

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

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // seconds until window resets
}

/**
 * Simple sliding window rate limiter using Upstash Redis.
 * Falls back to allowing all requests if Redis is unavailable.
 *
 * @param identifier - IP address or user ID
 * @param limit - max requests per window
 * @param windowSeconds - window duration in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 3600,
): Promise<RateLimitResult> {
  const r = getRedis();
  if (!r) {
    // Redis unavailable — allow (fail-open for dev/demo)
    return { allowed: true, remaining: limit, reset: 0 };
  }

  const key = `rl:${identifier}`;

  try {
    // Increment counter
    const count = await r.incr(key);

    if (count === 1) {
      // First request in window — set expiry
      await r.expire(key, windowSeconds);
    }

    const ttl = await r.ttl(key);
    const remaining = Math.max(0, limit - count);

    return {
      allowed: count <= limit,
      remaining,
      reset: ttl > 0 ? ttl : windowSeconds,
    };
  } catch {
    // Redis error — fail-open
    return { allowed: true, remaining: limit, reset: 0 };
  }
}
