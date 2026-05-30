"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORY_FILTERS } from "@/lib/constants";
import { DishLite, MenuAnalysisResult, RecentScan, RecentScanPreview } from "@/lib/types";
import DishRow from "@/components/dish/DishRow";
import DishCard from "@/components/dish/DishCard";
import LockedBlock from "@/components/common/LockedBlock";
import ComboRecommendation from "@/components/paywall/ComboRecommendation";
import TripPassPaywall from "@/components/paywall/TripPassPaywall";
import { useCart } from "@/hooks/useCart";
import { useCredits } from "@/hooks/useCredits";
import { useDishDetail, StoredMenuInput } from "@/hooks/useDishDetail";
import { useTranslation } from "@/lib/i18n";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { useExchangeRate } from "@/hooks/useExchangeRate";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [selectedDish, setSelectedDish] = useState<DishLite | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const credits = useCredits();
  const { isPhase2Free } = credits;
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [paymentBanner, setPaymentBanner] = useState<"success" | "cancelled" | null>(null);
  const comboRef = useRef<HTMLDivElement>(null);
  const [scanError, setScanError] = useState<{ code: string; reason: string; _debug?: string } | null>(null);
  const [menuInput, setMenuInput] = useState<StoredMenuInput | null>(null);
  const cart = useCart();
  const exchange = useExchangeRate();

  const dishToCartItem = (dish: DishLite) => ({
    dish_hash: dish.original,
    name_original: dish.original,
    name_translated: dish.translation.english,
    price: dish.price ? parseFloat(dish.price) || undefined : undefined,
    currency: dish.currency || "\u20A9",
  });

  const isDishInCart = (dish: DishLite) =>
    cart.items.some((item) => item.dish_hash === dish.original);

  // Use MenuAnalysisResult for both lite and full results (shape-compatible)
  const [data, setData] = useState<MenuAnalysisResult | null>(null);

  // Phase 2: detail for selected dish
  const { detail, isLoading: isDetailLoading, error: detailError, retry: retryDetail } =
    useDishDetail(selectedDish, menuInput);

  // Handle payment redirect (Stripe success/cancel)
  useEffect(() => {
    const payment = searchParams.get("payment");
    const plan = searchParams.get("plan");
    if (payment === "success" && plan) {
      if (plan === "pass_7d" || plan === "pass_30d") {
        credits.purchasePass(plan === "pass_7d" ? "7d" : "30d");
      } else if (plan === "credits_50") {
        credits.purchaseCredits(50);
      }
      setIsUnlocked(true);
      setPaymentBanner("success");
      // Clear query params without reload
      window.history.replaceState({}, "", "/results");
      const timer = setTimeout(() => setPaymentBanner(null), 4000);
      return () => clearTimeout(timer);
    } else if (payment === "cancelled") {
      setPaymentBanner("cancelled");
      window.history.replaceState({}, "", "/results");
      const timer = setTimeout(() => setPaymentBanner(null), 4000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const errorStr = sessionStorage.getItem("scanError");
    let resultStr = sessionStorage.getItem("scanResult");

    // If no fresh result, try loading from cache via URL param or sessionStorage key
    if (!errorStr && !resultStr) {
      const cachedKey = searchParams.get("id") || sessionStorage.getItem("scanResultKey");
      if (cachedKey) {
        try {
          const cache = JSON.parse(localStorage.getItem("transtaste_cached_results") || "{}");
          if (cache[cachedKey]) {
            resultStr = JSON.stringify(cache[cachedKey]);
          }
        } catch { /* ignore */ }
        sessionStorage.removeItem("scanResultKey");
      }
    }

    // Preserve menu input for Phase 2 detail requests
    const savedInput = sessionStorage.getItem("menuInputForDetail");
    if (savedInput) {
      try {
        setMenuInput(JSON.parse(savedInput));
      } catch { /* ignore */ }
      // Keep menuInputForDetail in sessionStorage — cleared on next scan
    }

    // Clear scan results after reading
    sessionStorage.removeItem("scanError");
    sessionStorage.removeItem("scanResult");

    if (errorStr) {
      // Parse structured error or treat as plain code string
      try {
        const parsed = JSON.parse(errorStr);
        setScanError({ code: parsed.error || errorStr, reason: parsed.reason || '', _debug: parsed._debug });
      } catch {
        setScanError({ code: errorStr, reason: '', _debug: undefined });
      }
    } else if (resultStr) {
      try {
        const parsed = JSON.parse(resultStr) as MenuAnalysisResult;
        setData(parsed);

        // Connect scan metadata to cart context
        const lang = parsed.menu_language || parsed.menu_meta?.language || "";
        if (lang) cart.setMenuLanguage(lang);
        const country = parsed.menu_meta?.country_detected || "";
        if (country) cart.setCountryDetected(country);

        // Cache full result and save to scan history
        // Use a resultKey we can dedupe on: if we restored from a cached id,
        // reuse that key instead of minting a new one (prevents revisits from
        // duplicating history entries).
        const cachedId = searchParams.get("id");
        const resultKey = cachedId || `scan_${Date.now()}`;
        try {
          // Determine output language to render preview text in the user's language
          let outputLang = "en";
          try {
            const rawSettings = localStorage.getItem("transtaste_user_settings");
            if (rawSettings) outputLang = JSON.parse(rawSettings).output_language || "en";
          } catch { /* ignore */ }

          const previewText = (d: DishLite): string => {
            if (outputLang === "en") return d.translation?.english || d.original;
            return d.translation?.meaning || d.translation?.english || d.original;
          };

          const preview: RecentScanPreview[] = parsed.dishes.slice(0, 3).map((d) => ({
            original: d.original,
            translated: previewText(d),
          }));

          const firstDish = parsed.dishes[0];
          const newEntry: RecentScan = {
            original: firstDish?.original || "Menu",
            english: firstDish?.translation?.english || firstDish?.original || "Menu",
            scannedAt: new Date().toISOString(),
            resultKey,
            dishCount: parsed.dishes.length,
            language: parsed.menu_meta?.language || parsed.menu_language,
            restaurantType: parsed.menu_meta?.restaurant_type || parsed.restaurant_type,
            preview,
          };

          // Cache full result (keep max 10)
          const cachedResults = JSON.parse(localStorage.getItem("transtaste_cached_results") || "{}");
          cachedResults[resultKey] = parsed;
          const keys = Object.keys(cachedResults).sort().reverse();
          if (keys.length > 10) {
            for (const old of keys.slice(10)) delete cachedResults[old];
          }
          localStorage.setItem("transtaste_cached_results", JSON.stringify(cachedResults));

          // Save history: 1 scan = 1 entry. Dedupe by resultKey to prevent
          // re-renders or revisits from accumulating duplicate rows.
          const prev: RecentScan[] = JSON.parse(localStorage.getItem("transtaste_scan_history") || "[]");
          const deduped = prev.filter((s) => s.resultKey !== resultKey);
          const merged = [newEntry, ...deduped].slice(0, 20);
          localStorage.setItem("transtaste_scan_history", JSON.stringify(merged));

          // Stamp URL with resultKey so revisits restore from cache
          if (!cachedId) {
            window.history.replaceState({}, "", `/results?id=${resultKey}`);
          }
        } catch { /* ignore */ }
      } catch {
        setScanError({ code: 'E_PARSE_FAIL', reason: 'Failed to parse scan results.' });
      }
    } else {
      // No fresh result, no cached id, no error — likely a stale tab revisit
      setScanError({ code: 'E_NO_INPUT', reason: 'No scan data available.' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: parse sessionStorage once
  }, []);

  const filteredDishes = !data
    ? []
    : activeFilter === "all"
      ? data.dishes
      : data.dishes.filter((d) => d.category === activeFilter);

  useEffect(() => {
    if (isPhase2Free) setIsUnlocked(true);
  }, [isPhase2Free]);

  // Fetch exchange rate when data is loaded and user has a home currency
  useEffect(() => {
    if (data && exchange.homeCurrency) {
      const menuCurrency = data.dishes[0]?.currency;
      if (menuCurrency && menuCurrency !== exchange.homeCurrency) {
        exchange.fetchRate(menuCurrency, exchange.homeCurrency);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, exchange.homeCurrency]);

  const handleUnlock = () => setShowPaywall(true);

  const handlePurchase = async (planId: string) => {
    // Map UI plan IDs to Stripe product IDs
    const stripeProductId =
      planId === "7d" ? "pass_7d" :
      planId === "30d" ? "pass_30d" :
      planId;

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: stripeProductId }),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }
    } catch {
      // Stripe unavailable — fall through to local purchase
    }

    // Fallback: local unlock (dev/demo mode)
    setIsUnlocked(true);
    setShowPaywall(false);
  };

  // No credits state — soft paywall with inline pricing
  if (scanError?.code === "E_NO_CREDITS") {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[340px]">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-brand/10 flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">{"\u{1F50D}"}</span>
            </div>
            <h2 className="text-lg font-bold text-brown-dark mb-2">
              {t("results.noScans")}
            </h2>
            <p className="text-sm text-brown-medium leading-relaxed">
              {t("results.noScansDesc")}
            </p>
          </div>

          {/* Inline pricing options */}
          <div className="space-y-2.5 mb-4">
            <Link
              href="/profile"
              className="flex items-center justify-between w-full p-3.5 bg-coral/5 border-2 border-coral rounded-xl hover:bg-coral/10 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-brown-dark">{t("paywall.pass7d")}</p>
                <p className="text-xs text-brown-medium">{t("paywall.unlimitedScans")}</p>
              </div>
              <span className="text-lg font-bold text-coral">$2.99</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center justify-between w-full p-3.5 bg-cream-dark border border-brown-light/20 rounded-xl hover:border-coral/30 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-brown-dark">{t("paywall.credits50")}</p>
                <p className="text-xs text-brown-medium">{t("paywall.credits50Desc")}</p>
              </div>
              <span className="text-base font-bold text-brown-dark">$1.99</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center justify-between w-full p-3.5 bg-cream-dark border border-brown-light/20 rounded-xl hover:border-coral/30 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-brown-dark">{t("paywall.pass30d")}</p>
                <p className="text-xs text-brown-medium">{t("paywall.pass30dDesc")}</p>
              </div>
              <span className="text-base font-bold text-brown-dark">$5.99</span>
            </Link>
          </div>

          <Link
            href="/"
            className="block w-full py-3 text-brown-medium font-medium text-sm text-center"
          >
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (scanError) {
    const errorMessages: Record<string, string> = {
      E_NO_INPUT: t("errors.noInput"),
      E_TIMEOUT: t("errors.timeout"),
      E_STREAM_END: t("errors.streamEnded"),
      E_FETCH_FAIL: t("errors.unexpected"),
      E_RATE_LIMIT: t("errors.rateLimited"),
      E_BAD_REQUEST: t("errors.unexpected"),
      E_AUTH: t("errors.authFailed"),
      E_NOT_MENU: t("errors.notMenu"),
      E_OCR_FAIL: t("errors.ocrFailed"),
      E_NO_TEXT: t("errors.noText"),
      E_PARTIAL: t("errors.partial"),
      E_PARSE_FAIL: t("errors.parseFailed"),
      E_AI_RATE_LIMIT: t("errors.rateLimited"),
      E_AI_ERROR: t("errors.aiError"),
      E_MAX_TOKENS: t("errors.maxTokens"),
      E_UNKNOWN: t("errors.unexpected"),
    };
    const userMessage = errorMessages[scanError.code] || scanError.reason || t("errors.unexpected");

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
            {t("results.somethingWrong")}
          </h2>
          <p className="text-sm text-brown-medium mb-4 leading-relaxed">
            {userMessage}
          </p>
          {/* Error code for debugging */}
          <p className="text-[10px] text-brown-medium/40 mb-6 font-mono select-all">
            {scanError.code}{scanError._debug ? ` · ${scanError._debug}` : ''}
          </p>
          <Link
            href="/camera"
            className="inline-block w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors text-center"
          >
            {t("common.tryAgain")}
          </Link>
          <Link
            href="/"
            className="inline-block mt-3 text-sm text-brown-medium hover:text-coral transition-colors"
          >
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  // No data yet — prompt to scan
  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-[320px]">
          <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">📷</span>
          </div>
          <h2 className="text-lg font-bold text-brown-dark mb-2">
            {t("results.menuResults")}
          </h2>
          <p className="text-sm text-brown-medium mb-6">
            {t("home.heroDesc")}
          </p>
          <Link
            href="/camera"
            className="inline-block w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors text-center"
          >
            {t("common.scanAMenu")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Payment banner */}
      {paymentBanner && (
        <div className={`fixed top-0 left-0 right-0 z-50 py-3 px-5 text-center text-sm font-semibold ${
          paymentBanner === "success" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
        }`}>
          {paymentBanner === "success" ? t("payment.success") : t("payment.cancelled")}
        </div>
      )}
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
            {t("common.back")}
          </Link>
          <span className="text-xs text-brown-medium bg-cream-dark px-2.5 py-1 rounded-full">
            {data.restaurant_type}
          </span>
        </div>
        <h1 className="text-lg font-bold text-brown-dark">
          {t("results.menuResults")}
        </h1>
        <p className="text-xs text-brown-medium">
          {t("results.dishesFound", { count: data.items_found ?? 0 })} &middot; {data.menu_language}
        </p>
      </div>

      {/* Demo mode banner */}
      {data.demo && (
        <div className="mx-5 mb-3 px-4 py-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-start gap-2">
          <span className="text-sm flex-shrink-0">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            {t("results.demoBanner")}
          </p>
        </div>
      )}

      {/* Exchange rate toggle */}
      {exchange.homeCurrency && exchange.rateData && exchange.rateData.rate !== 1 && (
        <div className="px-5 pb-2">
          <button
            onClick={exchange.toggleConversion}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              exchange.showConverted
                ? "bg-coral/15 text-coral border border-coral/30"
                : "bg-cream-dark text-brown-medium border border-transparent"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {exchange.showConverted
              ? t("results.showOriginal")
              : t("results.showConverted", { currency: exchange.homeCurrency })}
          </button>
        </div>
      )}

      {/* Category filters */}
      <div className="px-5 pb-3">
        <HorizontalScroll>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 snap-start whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === cat
                  ? "bg-coral text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </HorizontalScroll>
      </div>

      {/* Dish list */}
      <div className="flex-1 px-2 pb-40">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12 text-brown-medium text-sm">
            {t("results.noCategory")}
          </div>
        ) : (
          filteredDishes.map((dish, i) => {
            const d = dish;
            const price = d.price ? parseFloat(d.price) : null;
            const converted = price && d.currency ? exchange.convert(price, d.currency) : null;
            return (
              <DishRow
                key={i}
                dish={d}
                onClick={() => setSelectedDish(d)}
                onAddToCart={() => cart.addItem(dishToCartItem(d))}
                isInCart={isDishInCart(d)}
                convertedPrice={converted}
              />
            );
          })
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
                {t("combo.unlockCombos")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="sticky bottom-[72px] px-5 py-4 bg-cream/90 backdrop-blur-sm border-t border-brown-light/10">
        <button
          onClick={() => {
            const next = !showCombo;
            setShowCombo(next);
            if (next) setTimeout(() => comboRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }}
          className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors"
        >
          {showCombo ? t("results.hideCombo") : t("results.seeCombo")}
        </button>
      </div>

      {/* Floating "View Order" badge */}
      {cart.totalItems > 0 && (
        <div className="sticky bottom-[140px] z-10 flex justify-center pointer-events-none">
          <Link
            href="/order"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 bg-coral text-white text-sm font-semibold rounded-full shadow-lg hover:bg-coral-dark transition-colors"
          >
            {t("results.viewOrder")} &middot; {cart.totalItems} {cart.totalItems === 1 ? t("results.item") : t("results.items")}
          </Link>
        </div>
      )}

      {/* Dish detail bottom sheet */}
      <DishCard
        dish={selectedDish}
        detail={detail}
        isDetailLoading={isDetailLoading}
        detailError={detailError}
        onRetryDetail={retryDetail}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        isUnlocked={isUnlocked}
        onUnlock={handleUnlock}
        onAddToCart={selectedDish ? () => cart.addItem(dishToCartItem(selectedDish)) : undefined}
        isInCart={selectedDish ? isDishInCart(selectedDish) : false}
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
