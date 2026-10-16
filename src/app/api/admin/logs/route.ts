import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { readClientList, readDailyStats, readRequestLog, readRequestLogs } from "@/lib/telemetry";

export const dynamic = "force-dynamic";

// Owner-only log viewer. Requires the admin session cookie.
//   ?id=req_...            one request record
//   ?type=recent|errors    newest request records (default recent)
//   ?type=events|client_errors
//   ?type=stats&days=14    daily counters
//   &limit=50              (max 200)
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "E_AUTH", reason: "Admin session required." }, { status: 401 });
  }
  const params = request.nextUrl.searchParams;
  const limit = Math.min(Math.max(Number(params.get("limit")) || 50, 1), 200);
  const type = params.get("type") || "recent";
  const headers = { "Cache-Control": "no-store" };

  try {
    const id = params.get("id");
    if (id) {
      const record = await readRequestLog(id);
      return record
        ? NextResponse.json(record, { headers })
        : NextResponse.json({ error: "E_NOT_FOUND" }, { status: 404, headers });
    }
    if (type === "recent" || type === "errors") {
      return NextResponse.json({ type, items: await readRequestLogs(type, limit) }, { headers });
    }
    if (type === "events" || type === "client_errors") {
      return NextResponse.json({ type, items: await readClientList(type, limit) }, { headers });
    }
    if (type === "stats") {
      const days = Math.min(Math.max(Number(params.get("days")) || 14, 1), 90);
      return NextResponse.json({ type, days: await readDailyStats(days) }, { headers });
    }
    return NextResponse.json({ error: "E_BAD_REQUEST", reason: "Unknown type." }, { status: 400, headers });
  } catch (err) {
    console.error("[admin/logs] read failed", err);
    return NextResponse.json({ error: "E_UNKNOWN" }, { status: 500, headers });
  }
}
