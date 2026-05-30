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

  useEffect(() => {
    try {
      const raw = localStorage.getItem("transtaste_scan_history");
      if (raw) setScans(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-brown-dark">{t("history.title")}</h1>
        <p className="text-xs text-brown-medium mt-0.5">
          {t("history.subtitle")}
        </p>
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
                <button
                  key={scan.resultKey || i}
                  onClick={() => handleClick(scan)}
                  className="w-full flex items-center gap-3 p-3.5 bg-cream-dark rounded-xl hover:bg-brown-light/10 transition-colors text-left"
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
