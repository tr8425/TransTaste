"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import HorizontalScroll from "@/components/ui/HorizontalScroll";

type Tool = {
  id: string;
  href: string;
  emoji: string;
  labelKey: string;
  descKey: string;
  comingSoon?: boolean;
};

const TOOLS: readonly Tool[] = [
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
  { key: "travel.quickWater", phraseKey: "water_please", emoji: "\u{1F4A7}" },
  { key: "travel.quickCheck", phraseKey: "check_please", emoji: "\u{1F4B3}" },
  { key: "travel.quickNoSpicy", phraseKey: "is_spicy", emoji: "\u{1F336}\uFE0F" },
  { key: "travel.quickAllergy", phraseKey: "allergen_check", emoji: "\u{26A0}\uFE0F" },
];

const TIPS_PER_GROUP = 4;

export default function TravelPage() {
  const { t } = useTranslation();
  const [lastCountry] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("transtaste_user_settings");
      if (stored) {
        const settings = JSON.parse(stored);
        return settings.menu_language || null;
      }
      return null;
    } catch {
      return null;
    }
  });
  // Rotate which tip we show so revisits surface a different one each time.
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * TIPS_PER_GROUP));
  }, []);
  const tipGroup =
    lastCountry === "ja" || lastCountry === "ko" || lastCountry === "th"
      ? lastCountry
      : "default";
  const phraseLanguage =
    lastCountry === "ja" ||
    lastCountry === "zh" ||
    lastCountry === "th" ||
    lastCountry === "vi" ||
    lastCountry === "es" ||
    lastCountry === "fr" ||
    lastCountry === "it" ||
    lastCountry === "en"
      ? lastCountry
      : "ja";

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
              href={`/phrases?key=${p.phraseKey}&lang=${phraseLanguage}`}
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
        {TOOLS.map((tool) => {
          const cardContent = (
            <>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tool.comingSoon ? "bg-brown-light/10" : "bg-coral/10"}`}>
                <span className={`text-2xl ${tool.comingSoon ? "opacity-50" : ""}`}>{tool.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${tool.comingSoon ? "text-brown-medium" : "text-brown-dark"}`}>
                    {t(tool.labelKey)}
                  </p>
                  {tool.comingSoon && (
                    <span className="text-[10px] font-bold text-amber-brand bg-amber-brand/15 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t("travel.comingSoon")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-brown-medium mt-0.5">{t(tool.descKey)}</p>
              </div>
              {!tool.comingSoon && (
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
              )}
            </>
          );

          if (tool.comingSoon) {
            return (
              <div
                key={tool.id}
                aria-disabled="true"
                className="flex items-center gap-4 bg-cream-dark/60 rounded-xl p-4 cursor-not-allowed select-none"
              >
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="flex items-center gap-4 bg-cream-dark rounded-xl p-4 hover:bg-brown-light/10 transition-colors active:scale-[0.98]"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>

      {/* Tip of the day / context card */}
      <div className="px-5 mt-5">
        <div className="bg-amber-brand/10 rounded-xl p-4 border border-amber-brand/20">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{"\u{1F30D}"}</span>
            <div>
              <p className="text-xs font-semibold text-amber-brand mb-1">{t("travel.travelTip")}</p>
              <p className="text-xs text-brown-medium leading-relaxed">
                {t(`travel.tips.${tipGroup}.${tipIndex}`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
