import { NextRequest } from "next/server";
import { detectMenuRotation } from "@/lib/ai/claude";
import { fixtureDir } from "@/lib/ai/fixtures";
import { checkDailyBudget, checkRateLimit } from "@/lib/rate-limit";
import { clientIp, limiterRequired, rejectUntrustedRequest, securityLog } from "@/lib/api-guard";
import { isAdminRequest } from "@/lib/admin-session";
import { RequestLog } from "@/lib/telemetry";

// Orientation check for a menu photo before the scan. The client sends a
// ~512px thumbnail and turns the full image by the returned clockwise degrees.
// On any error status the client keeps the photo as it is, so scanning never
// depends on this route.

// A 512px JPEG thumbnail is ~30-80KB, ~110KB as base64; leave headroom.
const MAX_THUMBNAIL_CHARS = 300_000;

export async function POST(request: NextRequest) {
  const log = new RequestLog("orient", request);
  try {
    const rejected = rejectUntrustedRequest(request, "orient");
    if (rejected) {
      await log.finish({ status: rejected.status, code: rejected.status === 403 ? "E_FORBIDDEN" : "E_BAD_REQUEST" });
      return rejected;
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return log.respond({ error: "E_BAD_REQUEST", reason: "Invalid JSON" }, { status: 400 });
    }
    const image = body?.image;
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return log.respond({ error: "E_BAD_REQUEST", reason: "Missing 'image' data URL" }, { status: 400 });
    }
    if (image.length > MAX_THUMBNAIL_CHARS) {
      return log.respond({ error: "E_BAD_REQUEST", reason: "Thumbnail is too large" }, { status: 400 });
    }
    log.set({ input_type: "image", input_chars: image.length });

    if (!process.env.ANTHROPIC_API_KEY && !fixtureDir()) {
      return log.respond({ rotation: 0, demo: true });
    }

    // 60 checks per hour per IP: one per selected photo.
    const ip = clientIp(request);
    const isAdmin = isAdminRequest(request);
    log.set({ admin: isAdmin });
    const rl = isAdmin
      ? { allowed: true, remaining: Infinity, reset: 0, unavailable: false }
      : await checkRateLimit(`orient:${ip}`, 60, 3600);
    if ((rl.unavailable && limiterRequired()) || !rl.allowed) {
      if (!rl.allowed) securityLog("rate_limited", { route: "orient", ip });
      return log.respond({ error: rl.allowed ? "E_SERVICE_UNAVAILABLE" : "E_RATE_LIMIT", reason: "Orientation check skipped." }, { status: rl.allowed ? 503 : 429 });
    }

    // Site-wide daily cap, so many IPs cannot keep paid calls going past the budget.
    if (!isAdmin) {
      const budget = await checkDailyBudget("orient");
      if (!budget.allowed || (budget.unavailable && limiterRequired())) {
        securityLog("daily_budget_exhausted", { route: "orient" });
        return log.respond({ error: "E_DAILY_LIMIT", reason: "Orientation check skipped." }, { status: 503 });
      }
    }

    const result = await detectMenuRotation(image, log.telemetry);
    if ("error" in result) {
      return log.respond(result as unknown as Record<string, unknown>, { status: 422 });
    }
    log.set({ rotation: result.rotation, orient_thinking: result.thinking, ...(result.raw !== undefined ? { orient_raw: result.raw } : {}) });
    return log.respond({ rotation: result.rotation });
  } catch (err) {
    console.error("Orient API error:", err);
    log.set({ server_error: err instanceof Error ? err.message.slice(0, 300) : String(err) });
    return log.respond({ error: "E_UNKNOWN", reason: "Internal server error" }, { status: 500 });
  }
}
