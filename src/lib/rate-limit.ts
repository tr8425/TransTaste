import { getRedis } from '@/lib/redis';


interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // seconds until window resets
  unavailable: boolean; // true when the limiter could not run (no Redis or Redis error)
}

/**
 * Simple sliding window rate limiter using Upstash Redis.
 * Falls back to allowing requests if Redis is unavailable and flags the result
 * as `unavailable`, so callers that spend money can refuse instead (see limiterRequired).
 *
 * @param identifier - IP address or user ID
 * @param limit - max requests per window
 * @param windowSeconds - window duration in seconds
 */
const INCR_WITH_TTL = `
local count = redis.call('INCR', KEYS[1])
local ttl = redis.call('TTL', KEYS[1])
if ttl < 0 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return {count, ttl}
`;

export async function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 3600,
): Promise<RateLimitResult> {
  const r = getRedis();
  if (!r) {
    return { allowed: true, remaining: limit, reset: 0, unavailable: true };
  }

  const key = `rl:${identifier}`;

  try {
    // INCR and EXPIRE run atomically, and a counter left without a TTL (from an
    // older non-atomic version) gets one, so an IP can never be locked forever.
    const [count, ttl] = await r.eval<[number], [number, number]>(
      INCR_WITH_TTL,
      [key],
      [windowSeconds],
    );
    const remaining = Math.max(0, limit - count);

    return {
      allowed: count <= limit,
      remaining,
      reset: ttl > 0 ? ttl : windowSeconds,
      unavailable: false,
    };
  } catch {
    return { allowed: true, remaining: limit, reset: 0, unavailable: true };
  }
}

/**
 * Site-wide daily cap on paid AI calls, across all IPs. The limit comes from an
 * env var so it can follow the API budget; 0 or a non-number disables the cap.
 */
export async function checkDailyBudget(scope: 'scan' | 'detail' | 'enrich' | 'orient'): Promise<RateLimitResult> {
  const envName = { scan: 'DAILY_SCAN_LIMIT', detail: 'DAILY_DETAIL_LIMIT', enrich: 'DAILY_ENRICH_LIMIT', orient: 'DAILY_ORIENT_LIMIT' }[scope];
  const fallback = { scan: DEFAULT_DAILY_SCAN_LIMIT, detail: DEFAULT_DAILY_DETAIL_LIMIT, enrich: DEFAULT_DAILY_ENRICH_LIMIT, orient: DEFAULT_DAILY_ORIENT_LIMIT }[scope];
  const raw = process.env[envName];
  const limit = raw === undefined || raw === '' ? fallback : Number.parseInt(raw, 10);
  if (!Number.isFinite(limit) || limit <= 0) {
    return { allowed: true, remaining: Infinity, reset: 0, unavailable: false };
  }
  const day = new Date().toISOString().slice(0, 10); // UTC day
  return checkRateLimit(`daily:${scope}:${day}`, limit, 26 * 60 * 60);
}

// Defaults sized for a small API budget; override with DAILY_SCAN_LIMIT /
// DAILY_DETAIL_LIMIT / DAILY_ENRICH_LIMIT. A scan of a long menu uses about
// one enrich call per 20 dishes.
const DEFAULT_DAILY_SCAN_LIMIT = 30;
const DEFAULT_DAILY_DETAIL_LIMIT = 100;
const DEFAULT_DAILY_ENRICH_LIMIT = 120;
// Orientation checks cost well under a cent each; up to 10 photos per scan.
const DEFAULT_DAILY_ORIENT_LIMIT = 300;
