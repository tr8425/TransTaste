import { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES } from "@/lib/tip-culture-data";

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
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        <h1 className="text-2xl font-bold text-brown-dark mb-2">Country Dining Guides</h1>
        <p className="text-sm text-brown-medium mb-8">
          Tipping customs, dining etiquette & restaurant culture for travelers
        </p>

        <div className="grid grid-cols-2 gap-3">
          {COUNTRIES.map((country) => (
            <Link
              key={country.code}
              href={`/guide/${country.code.toLowerCase()}`}
              className="bg-cream-dark rounded-xl p-4 hover:bg-brown-light/10 transition-colors text-center"
            >
              <span className="text-2xl block mb-1">{country.flag}</span>
              <p className="text-sm font-semibold text-brown-dark">{country.name}</p>
              <p className="text-[10px] text-brown-medium mt-0.5">
                {country.tip.type === "none"
                  ? "No tip"
                  : `${country.tip.range_min}–${country.tip.range_max}% tip`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
