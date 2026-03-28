"use client";

import Link from "next/link";
import { RecentScan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface RecentHistoryProps {
  items: RecentScan[];
}

export default function RecentHistory({ items }: RecentHistoryProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium text-brown-medium mb-2 px-1 uppercase tracking-wider">
        {t("home.recentScans")}
      </h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {items.map((item, i) => (
          <Link
            key={i}
            href="/results"
            className="flex-shrink-0 flex items-center gap-2 bg-cream-dark rounded-full px-3 py-2.5 min-h-[44px] border border-brown-light/10 hover:border-coral/30 transition-colors"
          >
            <span className="text-sm font-medium text-brown-dark truncate max-w-[120px]">
              {item.original}
            </span>
            <span className="text-xs text-brown-medium whitespace-nowrap">
              {item.scannedAt}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
