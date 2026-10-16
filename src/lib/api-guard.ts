import { NextRequest, NextResponse } from "next/server";

// Server-side caps. Images match the camera screen's MAX_IMAGES; the per-image
// size leaves headroom over the client's ~300KB compressed JPEGs.
export const INPUT_LIMITS = {
  textChars: 20_000,
  urlChars: 2_048,
  images: 10,
  imageChars: 7_000_000,
  listItems: 20,
  listItemChars: 60,
  dishNameChars: 200,
  categoryChars: 40,
} as const;

export function securityLog(event: string, detail: Record<string, unknown> = {}) {
  console.warn(`[security] ${event}`, JSON.stringify(detail));
}

/** Prefer platform-provided IPs; x-forwarded-for is client-controlled off Vercel. */
export function clientIp(request: NextRequest): string {
  return (
    request.ip ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isSameSite(origin: string, request: NextRequest): boolean {
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const hosts = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    request.nextUrl.host,
  ];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try { hosts.push(new URL(siteUrl).host); } catch { /* ignore malformed */ }
  }
  return hosts.some((h) => h === originHost);
}

/**
 * Blocks cross-site browser calls and non-JSON bodies before any work is done.
 * Requests without an Origin header (curl, server-to-server) pass through and
 * are left to the rate limiter.
 */
export function rejectUntrustedRequest(request: NextRequest, route: string): NextResponse | null {
  const origin = request.headers.get("origin");
  if (origin && !isSameSite(origin, request)) {
    securityLog("cross_origin_rejected", { route, origin });
    return NextResponse.json({ error: "E_FORBIDDEN", reason: "Cross-origin requests are not allowed." }, { status: 403 });
  }
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("application/json")) {
    return NextResponse.json({ error: "E_BAD_REQUEST", reason: "Content-Type must be application/json." }, { status: 415 });
  }
  return null;
}

/** In production a real API key must not run without a working rate limiter. */
export function limiterRequired(): boolean {
  return process.env.NODE_ENV === "production" && process.env.RATE_LIMIT_FAIL_OPEN !== "true";
}

type Checked<T> = { ok: true; value: T } | { ok: false; reason: string };

export function checkString(value: unknown, field: string, maxChars: number, required = false): Checked<string | undefined> {
  if (value === undefined || value === null || value === "") {
    return required ? { ok: false, reason: `Missing '${field}'` } : { ok: true, value: undefined };
  }
  if (typeof value !== "string") return { ok: false, reason: `'${field}' must be a string` };
  if (value.length > maxChars) return { ok: false, reason: `'${field}' is too long` };
  return { ok: true, value };
}

export function checkStringList(value: unknown, field: string): Checked<string[] | undefined> {
  if (value === undefined || value === null) return { ok: true, value: undefined };
  if (!Array.isArray(value)) return { ok: false, reason: `'${field}' must be an array` };
  if (value.length > INPUT_LIMITS.listItems) return { ok: false, reason: `'${field}' has too many items` };
  for (const item of value) {
    if (typeof item !== "string" || item.length > INPUT_LIMITS.listItemChars) {
      return { ok: false, reason: `'${field}' items must be short strings` };
    }
  }
  return { ok: true, value: value as string[] };
}

export function checkLanguage(value: unknown): Checked<string | undefined> {
  if (value === undefined || value === null || value === "") return { ok: true, value: undefined };
  if (typeof value !== "string" || !/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})?$/.test(value)) {
    return { ok: false, reason: "Invalid 'outputLanguage'" };
  }
  return { ok: true, value };
}

/** Validates the menu payload for its input type. */
export function checkMenuInput(input: unknown, inputType: "image" | "url" | "text"): Checked<string> {
  if (typeof input !== "string" || !input) return { ok: false, reason: "Missing or invalid 'input' field" };

  if (inputType === "text") {
    return input.length > INPUT_LIMITS.textChars ? { ok: false, reason: "Menu text is too long" } : { ok: true, value: input };
  }

  if (inputType === "url") {
    if (input.length > INPUT_LIMITS.urlChars) return { ok: false, reason: "URL is too long" };
    try {
      const url = new URL(input);
      if (url.protocol !== "https:" && url.protocol !== "http:") return { ok: false, reason: "URL must use http or https" };
    } catch {
      return { ok: false, reason: "Invalid URL" };
    }
    return { ok: true, value: input };
  }

  const images = input.split("|||");
  if (images.length > INPUT_LIMITS.images) return { ok: false, reason: `At most ${INPUT_LIMITS.images} images per scan` };
  if (images.some((img) => img.length > INPUT_LIMITS.imageChars)) return { ok: false, reason: "Image is too large" };
  return { ok: true, value: input };
}
