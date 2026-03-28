"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { RecentScan } from "@/lib/types";
import { MOCK_RECENT_SCANS } from "@/lib/mock-data";
import { useTranslation } from "@/lib/i18n";

export default function HistoryPage() {
  const { t } = useTranslation();
  const [scans, setScans] = useState<RecentScan[]>([]);

  useEffect(() => {
    // TODO: Replace with Supabase query in Phase 2
    setScans(MOCK_RECENT_SCANS);
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
            {scans.map((scan, i) => (
              <Link
                key={i}
                href="/results"
                className="flex items-center gap-3 p-3.5 bg-cream-dark rounded-xl hover:bg-brown-light/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🍽️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brown-dark truncate">
                    {scan.original}
                  </p>
                  <p className="text-xs text-brown-medium">{scan.english}</p>
                </div>
                <span className="text-[11px] text-brown-medium/60 flex-shrink-0">
                  {scan.scannedAt}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
