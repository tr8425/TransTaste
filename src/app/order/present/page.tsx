"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import {
  ALLERGEN_LABELS,
  ALLERGY_HEADERS,
  DIETARY_LABELS,
  DIETARY_HEADERS,
  CONFIRM_LABELS,
  ORDER_HEADERS,
  TOTAL_LABELS,
  normalizeMenuLang,
} from "@/lib/allergen-i18n";
import { useTranslation } from "@/lib/i18n";
import { trackProductEvent } from "@/lib/product-events";

interface UserSettings {
  allergen_preset?: string[];
  dietary_beliefs?: string[];
}

function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem("transtaste_user_settings");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

function formatPrice(amount: number, currency?: string): string {
  if (!currency) return amount.toFixed(2);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}


export default function PresentPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { items, menuLanguage, totalPrice } = useCart();

  const [allergens, setAllergens] = useState<string[]>([]);
  const [dietaryBeliefs, setDietaryBeliefs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const lang = normalizeMenuLang(menuLanguage);
  const currency = items[0]?.currency;

  // Hydrate allergens from localStorage
  useEffect(() => {
    setMounted(true);
    trackProductEvent("present_mode_opened", { item_count: items.length });
    const settings = loadUserSettings();
    if (settings.allergen_preset) {
      setAllergens(settings.allergen_preset);
    }
    if (settings.dietary_beliefs) {
      setDietaryBeliefs(settings.dietary_beliefs);
    }
  }, [items.length]);

  // Wake Lock to prevent screen dimming
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        wakeLock = await navigator.wakeLock?.request("screen");
      } catch {
        /* Wake Lock not supported or failed */
      }
    }

    requestWakeLock();

    // Re-acquire on visibility change (when returning to tab)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      wakeLock?.release();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!mounted) return null;

  // If somehow landed here with no items, go back
  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream">
        <p className="text-lg text-gray-500 mb-4">{t("present.noItems")}</p>
        <button
          onClick={() => router.push("/order")}
          className="px-6 py-3 bg-coral text-white rounded-full font-semibold"
        >
          {t("present.goBack")}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-cream">
      <div className="max-w-mobile mx-auto px-5 py-6">
        <div className="mb-7 flex items-center justify-between border-b-2 border-brown-dark pb-4">
          <button
            type="button"
            onClick={() => router.push("/order")}
            aria-label={t("common.back")}
            className="grid h-11 w-11 place-items-center border border-brown-dark bg-cream-dark text-brown-dark"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[.08em] text-brown-dark">{t("present.showThisScreen")}</p>
            <p className="mt-0.5 text-[10px] text-brown-medium">{t("present.screenAwake")}</p>
          </div>
        </div>
        {/* Allergy banner — in menu language, large */}
        {allergens.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
            <p className="text-base font-bold text-red-700 mb-2">
              ⚠️ {ALLERGY_HEADERS[lang] ?? ALLERGY_HEADERS.en}
            </p>
            <div className="flex flex-wrap gap-2">
              {allergens.map((a) => (
                <span
                  key={a}
                  className="text-base font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full"
                >
                  {ALLERGEN_LABELS[a]?.[lang] ?? ALLERGEN_LABELS[a]?.en ?? a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dietary beliefs banner — in menu language */}
        {dietaryBeliefs.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-2xl">
            <p className="text-base font-bold text-green-700 mb-2">
              🥬 {DIETARY_HEADERS[lang] ?? DIETARY_HEADERS.en}
            </p>
            <div className="flex flex-wrap gap-2">
              {dietaryBeliefs.map((d) => (
                <span
                  key={d}
                  className="text-base font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full"
                >
                  {DIETARY_LABELS[d]?.[lang] ?? DIETARY_LABELS[d]?.en ?? d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Order header in menu language */}
        <h1 className="mb-6 border-l-4 border-coral pl-4 text-3xl font-bold text-brown-dark">
          {ORDER_HEADERS[lang] ?? ORDER_HEADERS.en}
        </h1>

        {/* Order items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.dish_hash}
              className="border-b border-brown-dark/20 bg-cream-dark p-4 shadow-[4px_4px_0_rgba(23,23,18,.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Original name — extra large, menu language, server-readable */}
                  <p className="break-words text-[36px] font-extrabold leading-tight text-brown-dark">
                    {item.name_original}
                  </p>
                  {/* Translated name — medium, for server context */}
                  <p className="mt-1 text-lg text-brown-medium">
                    {item.name_translated}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-3xl font-bold text-brown-dark">
                    ×{item.quantity}
                  </p>
                  {item.price != null && (
                    <p className="mt-1 text-lg text-brown-medium">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total in menu language */}
        <div className="mt-6 flex items-center justify-between border-t-2 border-brown-dark pt-4">
          <span className="text-2xl font-bold text-brown-dark">
            {TOTAL_LABELS[lang] ?? TOTAL_LABELS.en}
          </span>
          <span className="text-2xl font-bold text-brown-dark">
            {formatPrice(totalPrice, currency)}
          </span>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
          {t("present.disclaimer")}
        </p>

        {/* Confirmed button */}
        <div className="mt-6">
          <button
            onClick={() => {
              sessionStorage.setItem("order_confirmed", "1");
              router.push("/order");
            }}
            className="w-full border border-brown-dark bg-coral py-4 text-xl font-extrabold uppercase tracking-[.06em] text-brown-dark shadow-[5px_5px_0_#171712] transition active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {CONFIRM_LABELS[lang] ?? CONFIRM_LABELS.en}
          </button>
        </div>
      </div>
    </div>
  );
}
