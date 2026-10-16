import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

// Owner access: a code from ADMIN_ACCESS_CODE unlocks unlimited scans on the
// server's API key without sign-in. The code never reaches the client; the
// browser only holds an httpOnly cookie signed with a key derived from it, so
// changing the code revokes every existing admin session.

export const ADMIN_COOKIE = "tt_admin";
export const ADMIN_SESSION_DAYS = 30;
const MIN_CODE_CHARS = 12;

function adminCode(): string | null {
  const code = process.env.ADMIN_ACCESS_CODE?.trim();
  return code && code.length >= MIN_CODE_CHARS ? code : null;
}

export function adminConfigured(): boolean {
  return adminCode() !== null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function verifyAdminCode(candidate: unknown): boolean {
  const code = adminCode();
  if (!code || typeof candidate !== "string" || candidate.length > 256) return false;
  return timingSafeEqual(digest(candidate.trim()), digest(code));
}

function sign(expiresAt: number, code: string): string {
  const key = digest(`transtaste-admin:${code}`);
  return createHmac("sha256", key).update(String(expiresAt)).digest("base64url");
}

export function issueAdminToken(): { token: string; expiresAt: number } {
  const code = adminCode();
  if (!code) throw new Error("ADMIN_ACCESS_CODE is not configured");
  const expiresAt = Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { token: `${expiresAt}.${sign(expiresAt, code)}`, expiresAt };
}

/** Returns the session expiry (ms) when the request carries a valid admin cookie. */
export function adminSessionExpiry(request: NextRequest): number | null {
  const code = adminCode();
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!code || !token) return null;
  const [rawExpiry, signature] = token.split(".");
  const expiresAt = Number(rawExpiry);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now() || !signature) return null;
  const expected = Buffer.from(sign(expiresAt, code));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual) ? expiresAt : null;
}

export function isAdminRequest(request: NextRequest): boolean {
  return adminSessionExpiry(request) !== null;
}
