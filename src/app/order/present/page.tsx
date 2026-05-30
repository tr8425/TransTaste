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
    const settings = loadUserSettings();
    if (settings.allergen_preset) {
      setAllergens(settings.allergen_preset);
    }
    if (settings.dietary_beliefs) {
      setDietaryBeliefs(settings.dietary_beliefs);
    }
  }, []);

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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
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
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-mobile mx-auto px-5 py-6">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {ORDER_HEADERS[lang] ?? ORDER_HEADERS.en}
        </h1>

        {/* Order items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.dish_hash}
              className="border-b border-gray-100 pb-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Original name — extra large, menu language, server-readable */}
                  <p className="text-[40px] font-bold text-gray-900 leading-tight">
                    {item.name_original}
                  </p>
                  {/* Translated name — medium, for server context */}
                  <p className="text-lg text-gray-500 mt-1">
                    {item.name_translated}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-3xl font-bold text-gray-900">
                    ×{item.quantity}
                  </p>
                  {item.price != null && (
                    <p className="text-lg text-gray-600 mt-1">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total in menu language */}
        <div className="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            {TOTAL_LABELS[lang] ?? TOTAL_LABELS.en}
          </span>
          <span className="text-2xl font-bold text-gray-900">
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
            className="w-full py-4 bg-coral text-white text-xl font-bold rounded-full hover:bg-coral-dark transition-colors active:scale-[0.98]"
          >
            {CONFIRM_LABELS[lang] ?? CONFIRM_LABELS.en}
          </button>
        </div>
      </div>
    </div>
  );
}
