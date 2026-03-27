"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MOCK_MENU_RESULT } from "@/lib/mock-data";
import { CATEGORY_FILTERS } from "@/lib/constants";
import { Dish, MenuAnalysisResult } from "@/lib/types";
import DishRow from "@/components/dish/DishRow";
import DishCard from "@/components/dish/DishCard";
import LockedBlock from "@/components/common/LockedBlock";
import ComboRecommendation from "@/components/paywall/ComboRecommendation";
import TripPassPaywall from "@/components/paywall/TripPassPaywall";

export default function ResultsPage() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const [data, setData] = useState<MenuAnalysisResult>(MOCK_MENU_RESULT);

  useEffect(() => {
    const errorStr = sessionStorage.getItem("scanError");
    const resultStr = sessionStorage.getItem("scanResult");

    // Clear sessionStorage after reading
    sessionStorage.removeItem("scanError");
    sessionStorage.removeItem("scanResult");

    if (errorStr) {
      setScanError(errorStr);
    } else if (resultStr) {
      try {
        const parsed = JSON.parse(resultStr) as MenuAnalysisResult;
        setData(parsed);
      } catch {
        setScanError("Failed to parse scan results.");
      }
    }
    // If neither found, keep MOCK_MENU_RESULT (dev mode)
  }, []);

  const filteredDishes =
    activeFilter === "all"
      ? data.dishes
      : data.dishes.filter((d) => d.category === activeFilter);

  const handleUnlock = () => setShowPaywall(true);

  const handlePurchase = () => {
    setIsUnlocked(true);
    setShowPaywall(false);
  };

  // Error state
  if (scanError) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-[320px]">
          <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-5">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-coral"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-brown-dark mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-brown-medium mb-6 leading-relaxed">
            {scanError}
          </p>
          <Link
            href="/camera"
            className="inline-block w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors text-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-block mt-3 text-sm text-brown-medium hover:text-coral transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-1">
          <Link
            href="/"
            className="text-sm text-brown-medium hover:text-coral flex items-center gap-1"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </Link>
          <span className="text-xs text-brown-medium bg-cream-dark px-2.5 py-1 rounded-full">
            {data.restaurant_type}
          </span>
        </div>
        <h1 className="text-lg font-bold text-brown-dark">
          Menu Results
        </h1>
        <p className="text-xs text-brown-medium">
          {data.items_found} dishes found &middot; {data.menu_language}
        </p>
      </div>

      {/* Category filters */}
      <div className="relative px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pr-6">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                activeFilter === cat
                  ? "bg-coral text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Scroll hint fade */}
        <div className="absolute right-5 top-0 bottom-3 w-8 bg-gradient-to-l from-cream to-transparent pointer-events-none" />
      </div>

      {/* Dish list */}
      <div className="flex-1 px-2 pb-4">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12 text-brown-medium text-sm">
            No dishes in this category
          </div>
        ) : (
          filteredDishes.map((dish, i) => (
            <DishRow
              key={i}
              dish={dish}
              onClick={() => setSelectedDish(dish)}
            />
          ))
        )}
      </div>

      {/* Combo recommendation section */}
      {showCombo && (
        <div ref={comboRef} className="px-5 py-4 border-t border-brown-light/10">
          {isUnlocked ? (
            <ComboRecommendation combo={data.recommended_combo} />
          ) : (
            <div>
              <LockedBlock>
                <ComboRecommendation combo={data.recommended_combo} />
              </LockedBlock>
              <button
                onClick={handleUnlock}
                className="w-full mt-3 py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors"
              >
                Unlock Combos — $2.99
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom bar — above BottomNav */}
      <div className="sticky bottom-[72px] px-5 py-4 bg-cream/90 backdrop-blur-sm border-t border-brown-light/10">
        <button
          onClick={() => {
            const next = !showCombo;
            setShowCombo(next);
            if (next) setTimeout(() => comboRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }}
          className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors"
        >
          {showCombo ? "Hide Combos" : "See Combo Recommendations"}
        </button>
      </div>

      {/* Dish detail bottom sheet */}
      <DishCard
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        isUnlocked={isUnlocked}
        onUnlock={handleUnlock}
      />

      {/* Paywall */}
      <TripPassPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
