export type ProductEventName =
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
