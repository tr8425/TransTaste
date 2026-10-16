import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIp, limiterRequired, rejectUntrustedRequest, securityLog } from "@/lib/api-guard";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_DAYS,
  adminConfigured,
  adminSessionExpiry,
  issueAdminToken,
  verifyAdminCode,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

function sessionBody(expiresAt: number | null) {
  return { admin: expiresAt !== null, expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null };
}

export async function GET(request: NextRequest) {
  return NextResponse.json(sessionBody(adminSessionExpiry(request)), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const rejected = rejectUntrustedRequest(request, "admin");
  if (rejected) return rejected;

  if (!adminConfigured()) {
    return NextResponse.json({ error: "E_SERVICE_UNAVAILABLE", reason: "Admin access is not configured." }, { status: 503 });
  }

  // 5 attempts per 15 minutes per IP. Without a limiter, production refuses
  // rather than allowing unlimited guesses.
  const ip = clientIp(request);
  const rl = await checkRateLimit(`admin:${ip}`, 5, 900);
  if (rl.unavailable && limiterRequired()) {
    securityLog("rate_limiter_unavailable", { route: "admin" });
    return NextResponse.json({ error: "E_SERVICE_UNAVAILABLE", reason: "Admin access is temporarily unavailable." }, { status: 503 });
  }
  if (!rl.allowed) {
    securityLog("admin_rate_limited", { ip });
    return NextResponse.json(
      { error: "E_RATE_LIMIT", reason: `Too many attempts. Try again in ${Math.ceil(rl.reset / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(rl.reset) } },
    );
  }

  let code: unknown;
  try {
    code = (await request.json())?.code;
  } catch {
    return NextResponse.json({ error: "E_BAD_REQUEST", reason: "Invalid JSON" }, { status: 400 });
  }

  if (!verifyAdminCode(code)) {
    securityLog("admin_code_rejected", { ip });
    return NextResponse.json({ error: "E_AUTH", reason: "Invalid code." }, { status: 401 });
  }

  securityLog("admin_session_started", { ip });
  const { token, expiresAt } = issueAdminToken();
  const response = NextResponse.json(sessionBody(expiresAt));
  response.cookies.set(ADMIN_COOKIE, token, { ...cookieOptions, maxAge: ADMIN_SESSION_DAYS * 24 * 60 * 60 });
  return response;
}

export async function DELETE(request: NextRequest) {
  const rejected = rejectUntrustedRequest(request, "admin");
  if (rejected) return rejected;
  const response = NextResponse.json(sessionBody(null));
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
