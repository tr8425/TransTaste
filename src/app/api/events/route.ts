import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIp, rejectUntrustedRequest } from "@/lib/api-guard";
import { recordClientBatch, type ClientErrorRecord, type ClientEventRecord } from "@/lib/telemetry";

// Product events and client-side errors from the browser (sendBeacon).
// Best effort: malformed or excess entries are dropped, never rejected loudly.

const EVENT_NAMES = new Set([
  "page_view",
  "home_view",
  "scan_cta_click",
  "dietary_quick_select",
  "analysis_completed",
  "dish_opened",
  "dish_added_to_order",
  "present_mode_opened",
  "pricing_viewed",
  "purchase_intent_clicked",
]);
const MAX_EVENTS = 30;
const MAX_ERRORS = 5;
const MAX_PROPS = 10;

const str = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : undefined);

function cleanProps(value: unknown): Record<string, string | number | boolean> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, v] of Object.entries(value).slice(0, MAX_PROPS)) {
    if (!/^[a-z0-9_]{1,40}$/.test(key)) continue;
    if (typeof v === "string") out[key] = v.slice(0, 100);
    else if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
    else if (typeof v === "boolean") out[key] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

export async function POST(request: NextRequest) {
  // sendBeacon may label the body text/plain depending on the browser; the origin check still applies.
  const rejected = rejectUntrustedRequest(request, "events", { anyContentType: true });
  if (rejected) return rejected;

  // 120 batches per hour per IP. Without a limiter, drop rather than risk flooding Redis.
  const rl = await checkRateLimit(`events:${clientIp(request)}`, 120, 3600);
  if (!rl.allowed || rl.unavailable) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const events: ClientEventRecord[] = (Array.isArray(body.events) ? body.events : [])
    .slice(0, MAX_EVENTS)
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object" && EVENT_NAMES.has(String((e as Record<string, unknown>).name)))
    .map((e) => ({
      name: String(e.name),
      occurred_at: str(e.occurred_at, 40) || new Date().toISOString(),
      page: str(e.page, 200),
      properties: cleanProps(e.properties),
    }));

  const errors: ClientErrorRecord[] = (Array.isArray(body.errors) ? body.errors : [])
    .slice(0, MAX_ERRORS)
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object" && typeof (e as Record<string, unknown>).message === "string")
    .map((e) => ({
      message: String(e.message).slice(0, 500),
      source: str(e.source, 300),
      page: str(e.page, 200),
      stack: str(e.stack, 1500),
    }));

  await recordClientBatch(request, str(body.session_id, 40), events, errors);
  return new NextResponse(null, { status: 204 });
}
