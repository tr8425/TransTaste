export type ProductEventName =
  | "page_view"
  | "home_view"
  | "scan_cta_click"
  | "dietary_quick_select"
  | "analysis_completed"
  | "dish_opened"
  | "dish_added_to_order"
  | "present_mode_opened"
  | "pricing_viewed"
  | "purchase_intent_clicked";

export interface ProductEvent {
  id: string;
  name: ProductEventName;
  occurred_at: string;
  properties?: Record<string, string | number | boolean>;
}

const EVENT_STORAGE_KEY = "transtaste_product_events_v1";
const MAX_EVENTS = 200;

export function trackProductEvent(
  name: ProductEventName,
  properties?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;

  try {
    const current = JSON.parse(
      localStorage.getItem(EVENT_STORAGE_KEY) || "[]",
    ) as ProductEvent[];
    const event: ProductEvent = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      occurred_at: new Date().toISOString(),
      ...(properties ? { properties } : {}),
    };
    localStorage.setItem(
      EVENT_STORAGE_KEY,
      JSON.stringify([...current, event].slice(-MAX_EVENTS)),
    );
  } catch {
    // Product validation telemetry must never block the core flow.
  }
  enqueue("events", {
    name,
    occurred_at: new Date().toISOString(),
    page: window.location.pathname,
    ...(properties ? { properties } : {}),
  });
}

// ── Server delivery (POST /api/events) ────────────────────────────────────
// Batched and sent with sendBeacon so it survives navigation and never blocks UI.

const SESSION_KEY = "transtaste_session_id";
const FLUSH_DELAY_MS = 3000;
const queue: { events: unknown[]; errors: unknown[] } = { events: [], errors: [] };
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "s_unavailable";
  }
}

function enqueue(kind: "events" | "errors", entry: unknown) {
  if (typeof window === "undefined") return;
  queue[kind].push(entry);
  if (queue.events.length >= 20) {
    flushTelemetry();
    return;
  }
  if (!flushTimer) flushTimer = setTimeout(flushTelemetry, FLUSH_DELAY_MS);
}

export function flushTelemetry(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (typeof window === "undefined" || (!queue.events.length && !queue.errors.length)) return;
  const payload = JSON.stringify({
    session_id: sessionId(),
    events: queue.events.splice(0, 30),
    errors: queue.errors.splice(0, 5),
  });
  try {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/events", blob)) return;
  } catch { /* fall back to fetch */ }
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

let lastErrorKey = "";
export function reportClientError(message: string, details: { source?: string; stack?: string } = {}): void {
  if (typeof window === "undefined" || !message) return;
  const key = `${message}|${details.source ?? ""}`;
  if (key === lastErrorKey) return; // drop repeats of the same error in a loop
  lastErrorKey = key;
  enqueue("errors", { message, page: window.location.pathname, ...details });
}

export function getProductEvents(): ProductEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(EVENT_STORAGE_KEY) || "[]",
    ) as ProductEvent[];
  } catch {
    return [];
  }
}
