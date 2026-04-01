"use client";

import { useRouter } from "next/navigation";
import { RecentScan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import HorizontalScroll from "@/components/ui/HorizontalScroll";

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

interface RecentHistoryProps {
  items: RecentScan[];
}

export default function RecentHistory({ items }: RecentHistoryProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  if (items.length === 0) return null;

  const handleClick = (item: RecentScan) => {
    if (item.resultKey) {
      sessionStorage.setItem("scanResultKey", item.resultKey);
    }
    router.push("/results");
  };

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium text-brown-medium mb-2 px-1 uppercase tracking-wider">
        {t("home.recentScans")}
      </h3>
      <HorizontalScroll>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleClick(item)}
            className="flex-shrink-0 snap-start flex items-center gap-2 bg-cream-dark rounded-full px-3 py-2.5 min-h-[44px] border border-brown-light/10 hover:border-coral/30 transition-colors"
          >
            <span className="text-sm font-medium text-brown-dark truncate max-w-[120px]">
              {item.original}
            </span>
            <span className="text-xs text-brown-medium whitespace-nowrap">
              {formatRelativeTime(item.scannedAt, locale)}
            </span>
          </button>
        ))}
      </HorizontalScroll>
    </div>
  );
}
