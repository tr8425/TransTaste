"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RecentScan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

function formatRelativeTime(date: string | Date, locale: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return typeof date === "string" ? date : "";
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, threshold] of units) {
    if (seconds >= threshold) {
      return rtf.format(-Math.floor(seconds / threshold), unit);
    }
  }
  return rtf.format(0, "second");
}

export default function HistoryPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [scans, setScans] = useState<RecentScan[]>([]);

  const handleClick = (scan: RecentScan) => {
    if (scan.resultKey) {
      sessionStorage.setItem("scanResultKey", scan.resultKey);
      router.push(`/results?id=${scan.resultKey}`);
    } else {
      router.push("/results");
    }
  };

  const persist = (next: RecentScan[]) => {
    setScans(next);
    try {
      localStorage.setItem("transtaste_scan_history", JSON.stringify(next));
    } catch { /* ignore */ }
  };

  const handleDeleteOne = (e: React.MouseEvent, scan: RecentScan, index: number) => {
    e.stopPropagation();
    const next = scans.filter((s, i) => (s.resultKey ? s.resultKey !== scan.resultKey : i !== index));
    persist(next);
    // Also drop the cached result so it isn't restored on a stale link
    if (scan.resultKey) {
      try {
        const raw = localStorage.getItem("transtaste_cached_results");
        if (raw) {
          const cache = JSON.parse(raw);
          delete cache[scan.resultKey];
          localStorage.setItem("transtaste_cached_results", JSON.stringify(cache));
        }
      } catch { /* ignore */ }
    }
  };

  const handleClearAll = () => {
    if (typeof window !== "undefined" && !window.confirm(t("history.clearAllConfirm"))) return;
    persist([]);
    try {
      localStorage.removeItem("transtaste_cached_results");
    } catch { /* ignore */ }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("transtaste_scan_history");
      if (raw) setScans(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brown-dark">{t("history.title")}</h1>
          <p className="text-xs text-brown-medium mt-0.5">
            {t("history.subtitle")}
          </p>
        </div>
        {scans.length > 0 && (
          <button
            onClick={handleClearAll}
            className="mt-1 text-xs font-medium text-brown-medium hover:text-coral transition-colors flex-shrink-0"
          >
            {t("history.clearAll")}
          </button>
        )}
      </div>

      {/* Scan list */}
      <div className="flex-1 px-5 pb-28">
        {scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B6A50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 opacity-40"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p className="text-sm font-medium text-brown-dark mb-1">
              {t("history.noHistory")}
            </p>
            <p className="text-xs text-brown-medium mb-4 max-w-[220px]">
              {t("history.noHistoryDesc")}
            </p>
            <Link
              href="/camera"
              className="px-5 py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors"
            >
              {t("common.scanAMenu")}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {scans.map((scan, i) => {
              const isSession = typeof scan.dishCount === "number";
              const title = isSession
                ? [scan.restaurantType, scan.language].filter(Boolean).join(" · ") || scan.language || "Menu"
                : scan.original;
              const subtitle = isSession
                ? (scan.preview && scan.preview.length > 0
                    ? scan.preview.map((p) => p.translated).join(" · ")
                    : "")
                : scan.english;
              return (
                <div
                  key={scan.resultKey || i}
                  className="group relative w-full flex items-center gap-3 p-3.5 bg-cream-dark rounded-xl hover:bg-brown-light/10 transition-colors"
                >
                  <button
                    onClick={() => handleClick(scan)}
                    className="flex flex-1 items-center gap-3 min-w-0 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-brown-dark truncate">
                          {title}
                        </p>
                        {isSession && scan.dishCount! > 0 && (
                          <span className="text-[10px] font-semibold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            {scan.dishCount}
                          </span>
                        )}
                      </div>
                      {subtitle && (
                        <p className="text-xs text-brown-medium truncate">{subtitle}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-brown-medium/60 flex-shrink-0">
                      {formatRelativeTime(scan.scannedAt, locale)}
                    </span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteOne(e, scan, i)}
                    aria-label={t("history.deleteOne")}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-brown-medium/50 hover:text-coral hover:bg-coral/10 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
