"use client";

import { useState, useEffect } from "react";
import { COUNTRIES, LANGUAGE_TO_COUNTRY, type CountryInfo } from "@/lib/tip-culture-data";
import { useTranslation } from "@/lib/i18n";

function TipBadge({ tip, t }: { tip: CountryInfo["tip"]; t: (key: string, params?: Record<string, string | number>) => string }) {
  if (tip.type === "none") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success/15 text-success">
        {t("tipCulture.noTip")}
      </span>
    );
  }
  if (tip.type === "optional") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-brand/15 text-amber-brand">
        {t("tipCulture.optional", { min: tip.range_min!, max: tip.range_max! })}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-coral/15 text-coral">
      {t("tipCulture.expected", { min: tip.range_min!, max: tip.range_max! })}
    </span>
  );
}

function TipCalculator({ tip, t }: { tip: CountryInfo["tip"]; t: (key: string, params?: Record<string, string | number>) => string }) {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState(tip.range_min || 15);

  const presets = tip.type === "expected"
    ? [15, 18, 20]
    : [5, 10, 15];

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brown-medium">
            $
          </span>
          <input
            type="number"
            inputMode="decimal"
            placeholder={t("tipCulture.billAmount")}
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-cream border border-brown-light/20 text-sm text-brown-dark placeholder:text-brown-medium/40 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => setTipPercent(p)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
              tipPercent === p
                ? "bg-coral text-white"
                : "bg-cream border border-brown-light/20 text-brown-dark hover:border-coral/40"
            }`}
          >
            {p}%
          </button>
        ))}
      </div>

      {bill > 0 && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-coral/5">
          <div className="text-xs text-brown-medium">
            {t("tipCulture.tipLabel")} <span className="font-semibold text-brown-dark">${tipAmount.toFixed(2)}</span>
          </div>
          <div className="text-sm font-bold text-coral">
            {t("tipCulture.totalLabel")} ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

function CultureChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream text-xs font-medium text-brown-dark whitespace-nowrap border border-brown-light/10">
      {children}
    </span>
  );
}

const NO_TIP_DISMISS_KEY = "transtaste_no_tip_dismissed";

function isNoTipDismissed(): boolean {
  try {
    const raw = localStorage.getItem(NO_TIP_DISMISS_KEY);
    if (!raw) return false;
    const expiry = new Date(raw);
    if (expiry > new Date()) return true;
    localStorage.removeItem(NO_TIP_DISMISS_KEY);
    return false;
  } catch {
    return false;
  }
}

function dismissNoTipBanner() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  localStorage.setItem(NO_TIP_DISMISS_KEY, expiry.toISOString());
}

export default function TipCulturePage() {
  const { t } = useTranslation();
  const [selectedCode, setSelectedCode] = useState("JP");
  const [detectedCountry, setDetectedCountry] = useState<{ code: string; name: string; flag: string } | null>(null);
  const [noTipDismissed, setNoTipDismissed] = useState(true); // default true to avoid flash

  useEffect(() => {
    setNoTipDismissed(isNoTipDismissed());
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("menu_language");
      if (stored) {
        const countryCode = LANGUAGE_TO_COUNTRY[stored.toLowerCase()];
        if (countryCode) {
          const country = COUNTRIES.find((c) => c.code === countryCode);
          if (country) {
            setDetectedCountry({ code: country.code, name: country.name, flag: country.flag });
            setSelectedCode(country.code);
          }
        }
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const selected = COUNTRIES.find((c) => c.code === selectedCode)!;

  const waterLabel = (w: CountryInfo["culture"]["water"]) => {
    switch (w) {
      case "free": return "\u{1F4A7} " + t("tipCulture.freeWater");
      case "paid": return "\u{1F4A7} " + t("tipCulture.paidWater");
      case "self": return "\u{1F4A7} " + t("tipCulture.selfWater");
    }
  };

  const paymentLabel = (p: CountryInfo["culture"]["payment_location"]) => {
    switch (p) {
      case "table": return "\u{1F4B3} " + t("tipCulture.payTable");
      case "counter": return "\u{1F4B3} " + t("tipCulture.payCounter");
      case "either": return "\u{1F4B3} " + t("tipCulture.payEither");
    }
  };

  const utensilEmoji = (u: CountryInfo["dining"]["primary_utensil"]) => {
    switch (u) {
      case "chopsticks": return "\u{1F962}";
      case "fork_spoon": return "\u{1F944}";
      case "hands": return "\u{1F44B}";
      case "mixed": return "\u{1F374}";
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-brown-dark">{t("tipCulture.title")}</h1>
        {detectedCountry && (
          <p className="text-xs text-brown-medium mt-1">
            {t("tipCulture.basedOnScan", { flag: detectedCountry.flag, country: detectedCountry.name })}
          </p>
        )}
      </div>

      {/* Country selector */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelectedCode(country.code)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCode === country.code
                  ? "bg-coral text-white"
                  : "bg-cream-dark text-brown-dark hover:bg-brown-light/15"
              }`}
            >
              <span className="text-sm">{country.flag}</span>
              {country.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected country content */}
      <div className="px-5 space-y-3">
        {/* Tip section */}
        <div className="bg-cream-dark rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B6A50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span className="text-sm font-semibold text-brown-dark">{t("tipCulture.tipping")}</span>
          </div>
          <div className="mb-2">
            <TipBadge tip={selected.tip} t={t} />
          </div>
          <p className="text-xs text-brown-medium leading-relaxed">{selected.tip.note}</p>

          {selected.tip.type !== "none" && <TipCalculator tip={selected.tip} t={t} />}

          {/* No-tip country info banner */}
          {selected.tip.type === "none" && !noTipDismissed && (
            <div className="mt-3 bg-success/10 border border-success/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-success mb-1">
                {t("tipCulture.noTipBannerTitle")}
              </p>
              <p className="text-xs text-brown-medium leading-relaxed mb-2">
                {t("tipCulture.noTipBannerDesc", { country: selected.name })}
              </p>
              <button
                onClick={() => {
                  dismissNoTipBanner();
                  setNoTipDismissed(true);
                }}
                className="text-xs font-medium text-brown-medium hover:text-brown-dark transition-colors underline"
              >
                {t("tipCulture.dontShowTrip")}
              </button>
            </div>
          )}
        </div>

        {/* Culture chips */}
        <div className="bg-cream-dark rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">{"\u{1F30D}"}</span>
            <span className="text-sm font-semibold text-brown-dark">{t("tipCulture.restaurantCulture")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <CultureChip>{waterLabel(selected.culture.water)}</CultureChip>
            {selected.culture.side_dishes && (
              <CultureChip>{"\u{1F96C}"} {t("tipCulture.freeSides")}</CultureChip>
            )}
            <CultureChip>{paymentLabel(selected.culture.payment_location)}</CultureChip>
            <CultureChip>
              {selected.culture.tax_included ? "\u{1F9FE} " + t("tipCulture.taxIncluded") : "\u{1F9FE} " + t("tipCulture.taxExtra")}
            </CultureChip>
          </div>
        </div>

        {/* Dining etiquette */}
        <div className="bg-cream-dark rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">{"\u{1F37D}\uFE0F"}</span>
            <span className="text-sm font-semibold text-brown-dark">{t("tipCulture.diningEtiquette")}</span>
          </div>

          <div className="space-y-3">
            {/* Utensil */}
            <div className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0 mt-0.5">{utensilEmoji(selected.dining.primary_utensil)}</span>
              <p className="text-xs text-brown-medium leading-relaxed">
                {selected.dining.utensil_tip}
              </p>
            </div>

            {/* Meal times */}
            <div className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0 mt-0.5">{"\u{1F550}"}</span>
              <p className="text-xs text-brown-medium leading-relaxed">
                {t("tipCulture.lunch")} {selected.dining.lunch_hours} &middot; {t("tipCulture.dinner")} {selected.dining.dinner_hours}
              </p>
            </div>

            {/* Time note */}
            {selected.dining.time_note && (
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0 mt-0.5">{"\u{1F4A1}"}</span>
                <p className="text-xs text-brown-medium leading-relaxed italic">
                  {selected.dining.time_note}
                </p>
              </div>
            )}

            {/* Culture notes */}
            {selected.culture.notes.length > 0 && (
              <div className="mt-2 pt-3 border-t border-brown-light/10">
                <p className="text-xs font-semibold text-brown-dark mb-2">{t("tipCulture.goodToKnow")}</p>
                <ul className="space-y-1.5">
                  {selected.culture.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[10px] text-coral mt-1 flex-shrink-0">{"\u25CF"}</span>
                      <span className="text-xs text-brown-medium leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
