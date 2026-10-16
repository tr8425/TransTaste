"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { flushTelemetry, reportClientError, trackProductEvent } from "@/lib/product-events";

/** Sends page views and uncaught browser errors to /api/events. Renders nothing. */
export default function ClientTelemetry() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) trackProductEvent("page_view", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportClientError(event.message || "Unknown error", {
        source: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined,
        stack: event.error instanceof Error ? event.error.stack : undefined,
      });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      reportClientError(reason instanceof Error ? reason.message : String(reason), {
        source: "unhandledrejection",
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flushTelemetry();
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushTelemetry);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushTelemetry);
    };
  }, []);

  return null;
}
