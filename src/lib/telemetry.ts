import { createHash, createHmac, randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";
import { clientIp } from "@/lib/api-guard";

// Request logs for tracing errors and usage. Stored in Upstash Redis:
//   log:req:<id>        one JSON record per request, kept LOG_TTL_DAYS
//   log:recent          newest request ids (capped)
//   log:errors          newest failed request ids (capped)
//   stats:<YYYY-MM-DD>  daily counters (hash), kept STATS_TTL_DAYS
// Menu images are never stored; text menus keep a short preview only.
// Logging must never break or slow a request beyond one Redis round trip.

const LOG_TTL_DAYS = 30;
const STATS_TTL_DAYS = 90;
const RECENT_CAP = 1000;
const ERRORS_CAP = 500;
const TEXT_PREVIEW_CHARS = 300;

// Approximate USD per million tokens. Keep in sync with the pricing page.
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
};

export interface AiUsage {
  input_tokens?: number;
  output_tokens?: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}

export interface AiCallReport {
  model: string;
  usage?: AiUsage;
  stopReason?: string | null;
  upstreamStatus?: number;
  upstreamMessage?: string;
}

export interface AiTelemetry {
  report(call: AiCallReport): void;
}

export function newRequestId(): string {
  return `req_${Date.now().toString(36)}${randomBytes(4).toString("hex")}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Daily-rotating keyed hash: lets us group one visitor's requests within a day without storing the IP. */
export function hashIp(ip: string): string {
  const salt = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_ACCESS_CODE || "transtaste";
  return createHmac("sha256", `${salt}:${today()}`).update(ip).digest("hex").slice(0, 16);
}

function shortHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function deviceClass(ua: string | null): string {
  if (!ua) return "unknown";
  const os = /iPhone|iPad|iOS/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : /Windows/i.test(ua) ? "windows" : /Mac OS/i.test(ua) ? "mac" : "other";
  const browser = /Edg\//.test(ua) ? "edge" : /CriOS|Chrome\//.test(ua) ? "chrome" : /FxiOS|Firefox\//.test(ua) ? "firefox" : /Safari\//.test(ua) ? "safari" : /bot|crawl|spider|curl|node|python/i.test(ua) ? "bot" : "other";
  return `${os}/${browser}`;
}

export function estimateCostUsd(model: string, usage?: AiUsage): number {
  const price = PRICING[model];
  if (!price || !usage) return 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const input = (usage.input_tokens ?? 0) + cacheWrite * 1.25 + cacheRead * 0.1;
  return (input * price.input + (usage.output_tokens ?? 0) * price.output) / 1_000_000;
}

/** Summarises the menu payload without keeping images or full text. */
export function describeMenuInput(input: unknown, inputType: string): Record<string, unknown> {
  if (typeof input !== "string") return { input_type: inputType };
  const base = { input_type: inputType, input_chars: input.length, input_hash: shortHash(input) };
  if (inputType === "image") {
    const images = input.split("|||");
    const bytes = images.reduce((sum, img) => sum + Math.floor((img.length - (img.indexOf(",") + 1)) * 0.75), 0);
    return { ...base, image_count: images.length, image_bytes: bytes };
  }
  if (inputType === "url") {
    try {
      const url = new URL(input);
      return { ...base, url_host: url.host };
    } catch {
      return base;
    }
  }
  return { ...base, text_preview: input.slice(0, TEXT_PREVIEW_CHARS) };
}

export class RequestLog {
  readonly id = newRequestId();
  private readonly started = Date.now();
  private readonly data: Record<string, unknown>;
  private calls: AiCallReport[] = [];
  private deferred = false;
  private done = false;

  constructor(route: string, request: NextRequest) {
    this.data = {
      id: this.id,
      route,
      ts: new Date().toISOString(),
      ip_hash: hashIp(clientIp(request)),
      country: request.headers.get("x-vercel-ip-country") || null,
      device: deviceClass(request.headers.get("user-agent")),
      deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
    };
  }

  set(patch: Record<string, unknown>): void {
    Object.assign(this.data, patch);
  }

  /** Hook passed to the AI layer so token usage and upstream failures land in this record. */
  readonly telemetry: AiTelemetry = {
    report: (call) => {
      this.calls.push(call);
    },
  };

  /** The response is a stream; the stream calls finish() when it ends. */
  defer(): void {
    this.deferred = true;
  }

  /**
   * JSON response that carries the request id (header, and `ref` on errors) and
   * records the outcome. Awaited before returning: Vercel may freeze the
   * function once the response is sent, which would drop a pending write.
   */
  async respond(body: Record<string, unknown>, init?: { status?: number; headers?: Record<string, string> }): Promise<NextResponse> {
    const status = init?.status ?? 200;
    const isError = status >= 400 || typeof body.error === "string";
    const payload = isError ? { ...body, ref: this.id } : body;
    if (!this.deferred) {
      await this.finish({ status, code: isError ? String(body.error ?? `HTTP_${status}`) : undefined });
    }
    return NextResponse.json(payload, {
      status,
      headers: { ...(init?.headers ?? {}), "X-Request-Id": this.id },
    });
  }

  async finish(outcome: { status: number; code?: string; [key: string]: unknown }): Promise<void> {
    if (this.done) return;
    this.done = true;
    const r = getRedis();
    if (!r) return;

    const usage = this.calls.reduce(
      (sum, c) => ({
        input_tokens: sum.input_tokens + (c.usage?.input_tokens ?? 0),
        output_tokens: sum.output_tokens + (c.usage?.output_tokens ?? 0),
        cache_read_tokens: sum.cache_read_tokens + (c.usage?.cache_read_input_tokens ?? 0),
        cost_usd: sum.cost_usd + estimateCostUsd(c.model, c.usage),
      }),
      { input_tokens: 0, output_tokens: 0, cache_read_tokens: 0, cost_usd: 0 },
    );
    const record: Record<string, unknown> = {
      ...this.data,
      ...outcome,
      ok: !outcome.code,
      duration_ms: Date.now() - this.started,
      ai_calls: this.calls.length,
      ...(this.calls.length ? { ...usage, model: this.calls[0].model, stop_reason: this.calls.at(-1)?.stopReason ?? null } : {}),
      ...(this.calls.some((c) => c.upstreamStatus)
        ? {
            upstream_status: this.calls.find((c) => c.upstreamStatus)?.upstreamStatus,
            upstream_message: this.calls.find((c) => c.upstreamMessage)?.upstreamMessage?.slice(0, 300),
          }
        : {}),
    };

    const route = String(this.data.route);
    const statsKey = `stats:${today()}`;
    try {
      const p = r.pipeline();
      p.set(`log:req:${this.id}`, JSON.stringify(record), { ex: LOG_TTL_DAYS * 86400 });
      p.lpush("log:recent", this.id);
      p.ltrim("log:recent", 0, RECENT_CAP - 1);
      if (outcome.code) {
        p.lpush("log:errors", this.id);
        p.ltrim("log:errors", 0, ERRORS_CAP - 1);
        p.hincrby(statsKey, `${route}:error:${outcome.code}`, 1);
      }
      p.hincrby(statsKey, `${route}:requests`, 1);
      if (record.cache_hit) p.hincrby(statsKey, `${route}:cache_hits`, 1);
      if (this.calls.length) {
        p.hincrby(statsKey, `${route}:ai_calls`, this.calls.length);
        p.hincrby(statsKey, "input_tokens", usage.input_tokens);
        p.hincrby(statsKey, "output_tokens", usage.output_tokens);
        p.hincrby(statsKey, "cost_microusd", Math.round(usage.cost_usd * 1_000_000));
      }
      if (record.input_type) p.hincrby(statsKey, `${route}:input:${record.input_type}`, 1);
      if (record.output_language) p.hincrby(statsKey, `out_lang:${record.output_language}`, 1);
      if (record.country_detected) p.hincrby(statsKey, `menu_country:${record.country_detected}`, 1);
      if (record.country) p.hincrby(statsKey, `visitor_country:${record.country}`, 1);
      p.expire(statsKey, STATS_TTL_DAYS * 86400);
      await p.exec();
    } catch (err) {
      console.warn("[telemetry] failed to write request log", err);
    }
  }
}

// ── Client events and errors (POST /api/events) ─────────────────────────────

const EVENTS_CAP = 2000;
const CLIENT_ERRORS_CAP = 500;

export interface ClientEventRecord {
  name: string;
  occurred_at: string;
  page?: string;
  properties?: Record<string, string | number | boolean>;
}

export interface ClientErrorRecord {
  message: string;
  source?: string;
  page?: string;
  stack?: string;
}

export async function recordClientBatch(
  request: NextRequest,
  sessionId: string | undefined,
  events: ClientEventRecord[],
  errors: ClientErrorRecord[],
): Promise<void> {
  const r = getRedis();
  if (!r || (!events.length && !errors.length)) return;
  const context = {
    session: sessionId,
    ip_hash: hashIp(clientIp(request)),
    country: request.headers.get("x-vercel-ip-country") || null,
    device: deviceClass(request.headers.get("user-agent")),
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
  };
  const statsKey = `stats:${today()}`;
  try {
    const p = r.pipeline();
    for (const event of events) {
      p.lpush("log:events", JSON.stringify({ ...event, ...context }));
      p.hincrby(statsKey, `event:${event.name}`, 1);
    }
    for (const error of errors) {
      p.lpush("log:client_errors", JSON.stringify({ ...error, ...context, ts: new Date().toISOString() }));
      p.hincrby(statsKey, "client_errors", 1);
    }
    p.ltrim("log:events", 0, EVENTS_CAP - 1);
    p.ltrim("log:client_errors", 0, CLIENT_ERRORS_CAP - 1);
    p.expire(statsKey, STATS_TTL_DAYS * 86400);
    await p.exec();
  } catch (err) {
    console.warn("[telemetry] failed to write client events", err);
  }
}

// ── Admin read access ───────────────────────────────────────────────────────

export async function readRequestLogs(list: "recent" | "errors", limit: number): Promise<unknown[]> {
  const r = getRedis();
  if (!r) return [];
  const ids = await r.lrange<string>(`log:${list}`, 0, limit - 1);
  if (!ids.length) return [];
  const records = await r.mget<(string | object | null)[]>(...ids.map((id) => `log:req:${id}`));
  return records
    .map((rec) => (typeof rec === "string" ? JSON.parse(rec) : rec))
    .filter(Boolean);
}

export async function readRequestLog(id: string): Promise<unknown | null> {
  const r = getRedis();
  if (!r || !/^req_[a-z0-9]+$/.test(id)) return null;
  const rec = await r.get<string | object>(`log:req:${id}`);
  return typeof rec === "string" ? JSON.parse(rec) : rec ?? null;
}

export async function readClientList(list: "events" | "client_errors", limit: number): Promise<unknown[]> {
  const r = getRedis();
  if (!r) return [];
  const rows = await r.lrange<string | object>(`log:${list}`, 0, limit - 1);
  return rows.map((row) => (typeof row === "string" ? JSON.parse(row) : row));
}

export async function readDailyStats(days: number): Promise<Record<string, Record<string, number>>> {
  const r = getRedis();
  if (!r) return {};
  const out: Record<string, Record<string, number>> = {};
  for (let i = 0; i < days; i++) {
    const day = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    const hash = await r.hgetall<Record<string, number>>(`stats:${day}`);
    if (hash) out[day] = hash;
  }
  return out;
}
