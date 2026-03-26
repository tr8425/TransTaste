"use client";

import Link from "next/link";
import CreditBadge from "@/components/common/CreditBadge";
import RecentHistory from "@/components/common/RecentHistory";
import { useCredits } from "@/hooks/useCredits";
import { MOCK_RECENT_SCANS } from "@/lib/mock-data";

export default function HomePage() {
  const credits = useCredits();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav bar */}
      <nav className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-brown-dark tracking-tight">
          Trans<span className="text-coral">Taste</span>
        </h1>
        <CreditBadge credits={credits.remaining} hasPass={credits.hasPass} />
      </nav>

      {/* Hero — compact */}
      <div className="flex flex-col items-center px-6 pt-4">
        <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-coral/10 via-cream-dark to-amber-brand/10 flex items-center justify-center mb-5">
          <span className="text-5xl">🍽️</span>
        </div>

        <h2 className="text-lg font-semibold text-brown-dark text-center mb-1">
          Scan any menu, understand every dish
        </h2>
        <p className="text-sm text-brown-medium text-center mb-6 max-w-[280px]">
          Point your camera at a foreign menu and get instant translations, allergens & fun facts
        </p>

        {/* Camera CTA */}
        <Link
          href="/camera"
          className="w-[72px] h-[72px] rounded-full bg-coral shadow-lg shadow-coral/30 flex items-center justify-center hover:bg-coral-dark transition-colors active:scale-95 mb-3"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </Link>

        <Link
          href="/results"
          className="text-sm font-medium text-brown-medium hover:text-coral transition-colors flex items-center gap-1.5 mb-6"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          Choose from gallery
        </Link>
      </div>

      {/* Recent scans */}
      <div className="px-5 pt-2 pb-2">
        <RecentHistory items={MOCK_RECENT_SCANS} />
      </div>

      {/* Trending dishes section */}
      <div className="px-5 pt-4 pb-28">
        <h3 className="text-xs font-medium text-brown-medium mb-3 px-1 uppercase tracking-wider">
          Popular Dishes Nearby
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { emoji: "🍜", name: "Pho Bo", origin: "Vietnamese" },
            { emoji: "🍣", name: "Omakase", origin: "Japanese" },
            { emoji: "🥘", name: "Tom Yum", origin: "Thai" },
            { emoji: "🥟", name: "Xiao Long Bao", origin: "Chinese" },
          ].map((dish) => (
            <div
              key={dish.name}
              className="bg-cream-dark rounded-xl p-3 flex items-center gap-2.5 hover:bg-brown-light/10 transition-colors cursor-pointer"
            >
              <span className="text-2xl">{dish.emoji}</span>
              <div>
                <p className="text-sm font-medium text-brown-dark leading-tight">
                  {dish.name}
                </p>
                <p className="text-[11px] text-brown-medium">{dish.origin}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
