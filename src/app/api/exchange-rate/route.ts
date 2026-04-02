import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const CACHE_KEY = 'exchange_rates';
const CACHE_TTL = 23 * 60 * 60; // 23 hours

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  updated_at: string;
}

async function fetchRates(): Promise<ExchangeRates | null> {
  // Free tier: exchangerate-api.com (1500 req/month)
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  const url = apiKey
    ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    : 'https://open.er-api.com/v6/latest/USD'; // Fallback: free, no key needed

  try {
    const res = await fetch(url, { next: { revalidate: CACHE_TTL } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result === 'success' || data.rates) {
      return {
        base: 'USD',
        rates: data.conversion_rates || data.rates,
        updated_at: new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get('from') || 'USD').toUpperCase();
  const to = (searchParams.get('to') || 'KRW').toUpperCase();

  // Try Redis cache first
  const redis = getRedis();
  let rates: ExchangeRates | null = null;

  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        rates = typeof cached === 'string' ? JSON.parse(cached) : cached as ExchangeRates;
      }
    } catch { /* ignore */ }
  }

  // Fetch fresh rates if cache miss
  if (!rates) {
    rates = await fetchRates();
    if (rates && redis) {
      try {
        await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(rates));
      } catch { /* ignore */ }
    }
  }

  if (!rates) {
    return NextResponse.json({ error: 'Failed to fetch exchange rates' }, { status: 503 });
  }

  const fromRate = rates.rates[from];
  const toRate = rates.rates[to];

  if (!fromRate || !toRate) {
    return NextResponse.json({ error: `Currency not found: ${!fromRate ? from : to}` }, { status: 400 });
  }

  const rate = toRate / fromRate;

  return NextResponse.json({
    from,
    to,
    rate,
    updated_at: rates.updated_at,
  });
}
