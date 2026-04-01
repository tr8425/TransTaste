"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import HorizontalScroll from "@/components/ui/HorizontalScroll";

const TOOLS = [
  {
    id: "phrases",
    href: "/phrases",
    emoji: "\u{1F4AC}",
    labelKey: "travel.phrases",
    descKey: "travel.phrasesDesc",
  },
  {
    id: "tip-culture",
    href: "/tip-culture",
    emoji: "\u{1F4A1}",
    labelKey: "travel.tipCulture",
    descKey: "travel.tipCultureDesc",
  },
  {
    id: "order",
    href: "/order",
    emoji: "\u{1F4CB}",
    labelKey: "travel.order",
    descKey: "travel.orderDesc",
  },
] as const;

const QUICK_PHRASES = [
  { key: "travel.quickWater", emoji: "\u{1F4A7}" },
  { key: "travel.quickCheck", emoji: "\u{1F4B3}" },
  { key: "travel.quickNoSpicy", emoji: "\u{1F336}\uFE0F" },
  { key: "travel.quickAllergy", emoji: "\u{26A0}\uFE0F" },
];

export default function TravelPage() {
  const { t } = useTranslation();
  const [lastCountry] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("menu_language");
      return raw || null;
    } catch {
      return null;
    }
  });

  return (
    <main className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <header className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-bold text-brown-dark">{t("travel.title")}</h1>
        <p className="text-sm text-brown-medium mt-0.5">
          {t("travel.subtitle")}
        </p>
      </header>

      {/* Quick phrase chips */}
      <div className="px-5 py-3">
        <HorizontalScroll>
          {QUICK_PHRASES.map((p) => (
            <Link
              key={p.key}
              href="/phrases"
              className="flex-shrink-0 snap-start flex items-center gap-1.5 bg-coral/10 text-coral px-3.5 py-2 rounded-full text-xs font-semibold hover:bg-coral/20 transition-colors"
            >
              <span>{p.emoji}</span>
              {t(p.key)}
            </Link>
          ))}
        </HorizontalScroll>
      </div>

      {/* Tool cards */}
      <div className="px-5 space-y-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="flex items-center gap-4 bg-cream-dark rounded-xl p-4 hover:bg-brown-light/10 transition-colors active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{tool.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brown-dark">{t(tool.labelKey)}</p>
              <p className="text-xs text-brown-medium mt-0.5">{t(tool.descKey)}</p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C4A882"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Tip of the day / context card */}
      <div className="px-5 mt-5">
        <div className="bg-amber-brand/10 rounded-xl p-4 border border-amber-brand/20">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{"\u{1F30D}"}</span>
            <div>
              <p className="text-xs font-semibold text-amber-brand mb-1">{t("travel.travelTip")}</p>
              <p className="text-xs text-brown-medium leading-relaxed">
                {lastCountry === "ja"
                  ? t("travel.tipJa")
                  : lastCountry === "ko"
                  ? t("travel.tipKo")
                  : lastCountry === "th"
                  ? t("travel.tipTh")
                  : t("travel.tipDefault")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
