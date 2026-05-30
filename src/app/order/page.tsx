"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ALLERGEN_LABELS, TIP_CULTURE, normalizeMenuLang } from "@/lib/allergen-i18n";
import { useTranslation } from "@/lib/i18n";

interface UserSettings {
  allergen_preset?: string[];
  language?: string;
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

export default function OrderPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    countryDetected,
    menuLanguage,
  } = useCart();

  const { t } = useTranslation();
  const langCode = normalizeMenuLang(menuLanguage);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    const settings = loadUserSettings();
    if (settings.allergen_preset) {
      setAllergens(settings.allergen_preset);
    }
    if (sessionStorage.getItem("order_confirmed") === "1") {
      setShowConfirmedBanner(true);
      sessionStorage.removeItem("order_confirmed");
    }
  }, []);

  if (!mounted) return null;

  const currency = items[0]?.currency;
  const tipInfo = TIP_CULTURE[countryDetected] ?? null;
  const tipAmount =
    tipInfo && tipInfo.percent > 0 ? totalPrice * (tipInfo.percent / 100) : 0;
  const grandTotal = totalPrice + tipAmount;

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pb-28 bg-cream">
        <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mb-4">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-brown-medium/40"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-brown-dark mb-1">
          {t("order.noItemsYet")}
        </h2>
        <p className="text-sm text-brown-medium mb-6 text-center">
          {t("order.scanToStart")}
        </p>
        <Link
          href="/camera"
          className="px-6 py-3 bg-coral text-white rounded-full text-sm font-semibold hover:bg-coral-dark transition-colors active:scale-95"
        >
          {t("order.openCamera")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-md border-b border-brown-light/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-brown-dark">{t("order.yourOrder")}</h1>
          <span className="bg-coral text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {totalItems}
          </span>
        </div>
      </div>

      {/* Confirmed banner */}
      {showConfirmedBanner && (
        <div className="mx-4 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm font-semibold text-emerald-800 mb-2">
            ✅ {t("order.orderDone")}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { clearCart(); setShowConfirmedBanner(false); }}
              className="flex-1 py-2 bg-coral text-white text-sm font-semibold rounded-lg active:scale-95 transition-transform"
            >
              {t("order.clearCart")}
            </button>
            <button
              onClick={() => setShowConfirmedBanner(false)}
              className="px-4 py-2 bg-brown-light/10 text-brown-dark text-sm font-medium rounded-lg"
            >
              {t("order.keepOrder")}
            </button>
          </div>
        </div>
      )}

      {/* Allergy banner */}
      {allergens.length > 0 && (
        <div className="mx-4 mt-4 p-3 bg-danger/10 border border-danger/20 rounded-xl">
          <div className="flex items-start gap-2">
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-danger mb-1">
                {t("order.allergyAlert")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {allergens.map((a) => (
                  <span
                    key={a}
                    className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full font-medium"
                  >
                    {ALLERGEN_LABELS[a]?.[langCode] ?? ALLERGEN_LABELS[a]?.en ?? a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="px-4 mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.dish_hash}
            className="bg-white rounded-xl p-4 shadow-sm border border-brown-light/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brown-dark truncate">
                  {item.name_translated}
                </p>
                <p className="text-xs text-brown-medium mt-0.5 truncate">
                  {item.name_original}
                </p>
                {item.price != null && (
                  <p className="text-sm font-medium text-brown-dark mt-1">
                    {formatPrice(item.price, item.currency)}
                  </p>
                )}
              </div>

              {/* Quantity stepper + remove */}
              <div className="flex items-center gap-1">
                <div className="flex items-center bg-cream-dark rounded-lg">
                  <button
                    onClick={() =>
                      updateQuantity(item.dish_hash, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center text-brown-medium hover:text-brown-dark transition-colors"
                    aria-label={t("common.aria.decreaseQuantity")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-brown-dark">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.dish_hash, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center text-brown-medium hover:text-brown-dark transition-colors"
                    aria-label={t("common.aria.increaseQuantity")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.dish_hash)}
                  className="w-8 h-8 flex items-center justify-center text-brown-medium/40 hover:text-danger transition-colors ml-1"
                  aria-label={t("common.aria.removeItem")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more */}
      <div className="px-4 mt-3">
        <Link
          href="/results"
          className="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-coral hover:text-coral-dark transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t("order.addFromMenu")}
        </Link>
      </div>

      {/* Summary */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm border border-brown-light/5">
        <div className="flex justify-between text-sm text-brown-dark mb-2">
          <span>{t("order.subtotal")}</span>
          <span className="font-medium">
            {formatPrice(totalPrice, currency)}
          </span>
        </div>

        {tipInfo && (
          <div className="flex justify-between text-sm text-brown-medium mb-2">
            <span>{t(`tipCulture.tipNote.${tipInfo.noteKey}`)}</span>
            <span>
              {tipAmount > 0
                ? formatPrice(tipAmount, currency)
                : "—"}
            </span>
          </div>
        )}

        <div className="border-t border-brown-light/10 pt-2 mt-2 flex justify-between text-base font-bold text-brown-dark">
          <span>{t("order.total")}</span>
          <span>{formatPrice(grandTotal, currency)}</span>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 mt-6 space-y-3">
        <Link
          href="/order/present"
          className="block w-full py-3.5 bg-coral text-white text-center rounded-full font-semibold text-base hover:bg-coral-dark transition-colors active:scale-[0.98]"
        >
          {t("order.showToServer")}
        </Link>
        <Link
          href="/phrases"
          className="block w-full py-2 text-center text-sm font-medium text-brown-medium hover:text-brown-dark transition-colors"
        >
          {t("order.orderWithPhrases")}
        </Link>
      </div>
    </div>
  );
}
