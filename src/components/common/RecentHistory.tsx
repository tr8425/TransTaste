"use client";

import Link from "next/link";
import { RecentScan } from "@/lib/types";

interface RecentHistoryProps {
  items: RecentScan[];
}

export default function RecentHistory({ items }: RecentHistoryProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium text-brown-medium mb-2 px-1 uppercase tracking-wider">
        Recent Scans
      </h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {items.map((item, i) => (
          <Link
            key={i}
            href="/results"
            className="flex-shrink-0 flex items-center gap-2 bg-cream-dark rounded-full px-3 py-1.5 border border-brown-light/10 hover:border-coral/30 transition-colors"
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
