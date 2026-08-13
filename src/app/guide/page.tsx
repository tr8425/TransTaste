import { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES } from "@/lib/tip-culture-data";
import { t } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Country Dining Guides — Tipping & Etiquette",
  description:
    "Restaurant guides for 20+ countries. Tipping customs, dining etiquette, meal times, and cultural tips for international travelers.",
  openGraph: {
    title: "Country Dining Guides — TransTaste",
    description: "Know how to eat, tip, and behave at restaurants in 20+ countries.",
  },
};

export default function GuideIndexPage() {
  return (
    <main className="min-h-screen bg-cream pb-28">
      <div className="mx-auto max-w-prose px-5 pb-8 pt-12">
        <p className="mengto-kicker mb-2 text-[10px] font-extrabold text-coral">Atlas · 20+ tables</p>
        <h1 className="mb-2 text-3xl font-bold text-brown-dark">{t("guide.title")}</h1>
        <p className="text-sm text-brown-medium mb-8">
          {t("guide.subtitle")}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {COUNTRIES.map((country) => (
            <Link
              key={country.code}
              href={`/guide/${country.code.toLowerCase()}`}
              className="border border-brown-dark bg-cream-dark p-4 text-center shadow-[3px_3px_0_rgba(23,23,18,.12)] transition hover:-translate-y-1"
            >
              <span className="text-2xl block mb-1">{country.flag}</span>
              <p className="text-sm font-semibold text-brown-dark">{t(`country.${country.code}.name`)}</p>
              <p className="text-[10px] text-brown-medium mt-0.5">
                {country.tip.type === "none"
                  ? t("tipCulture.noTip")
                  : t("guide.tipRange", { min: country.tip.range_min, max: country.tip.range_max })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
