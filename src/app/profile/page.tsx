"use client";

import { useState, useEffect, useCallback } from "react";
import { useCredits } from "@/hooks/useCredits";
import TripPassPaywall from "@/components/paywall/TripPassPaywall";
import { AllergenType, DietaryLabel } from "@/lib/types";

/* ─── Constants ─── */

const SETTINGS_KEY = "transtaste_user_settings";

const OUTPUT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
  { value: "th", label: "ไทย" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

const MENU_LANGUAGES = [
  { value: "auto", label: "Auto-detect" },
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "th", label: "Thai" },
  { value: "vi", label: "Vietnamese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const ALL_ALLERGENS: { value: AllergenType; label: string; emoji: string }[] = [
  { value: "shellfish", label: "Shellfish", emoji: "🦐" },
  { value: "pork", label: "Pork", emoji: "🥓" },
  { value: "gluten", label: "Gluten", emoji: "🌾" },
  { value: "dairy", label: "Dairy", emoji: "🥛" },
  { value: "nuts", label: "Nuts", emoji: "🥜" },
  { value: "egg", label: "Egg", emoji: "🥚" },
  { value: "soy", label: "Soy", emoji: "🫘" },
];

const ALL_DIETARY: { value: DietaryLabel; label: string }[] = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "halal", label: "Halal" },
  { value: "gluten-free", label: "Gluten-Free" },
];

/* ─── Settings Shape ─── */

interface UserSettings {
  outputLanguage: string;
  menuLanguage: string;
  allergens: AllergenType[];
  dietary: DietaryLabel[];
  email: string | null;
}

const DEFAULT_SETTINGS: UserSettings = {
  outputLanguage: "en",
  menuLanguage: "auto",
  allergens: [],
  dietary: [],
  email: null,
};

/* ─── Page ─── */

export default function ProfilePage() {
  const credits = useCredits();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [showAllergenGrid, setShowAllergenGrid] = useState(false);
  const [showDietaryGrid, setShowDietaryGrid] = useState(false);

  // Load settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist helper
  const save = useCallback((next: UserSettings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleAllergen = (a: AllergenType) => {
    const next = settings.allergens.includes(a)
      ? settings.allergens.filter((x) => x !== a)
      : [...settings.allergens, a];
    save({ ...settings, allergens: next });
  };

  const toggleDietary = (d: DietaryLabel) => {
    const next = settings.dietary.includes(d)
      ? settings.dietary.filter((x) => x !== d)
      : [...settings.dietary, d];
    save({ ...settings, dietary: next });
  };

  const handlePurchase = (planId: string) => {
    if (planId === "7d" || planId === "30d") {
      credits.purchasePass(planId);
    } else if (planId === "credits50") {
      credits.purchaseCredits(50);
    }
    setPaywallOpen(false);
  };

  // Format pass expiry
  const passExpiry = credits.passExpiresAt
    ? new Date(credits.passExpiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-brown-dark">Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-28 space-y-4">
        {/* ── Credits & Pass ── */}
        <div className="bg-cream-dark rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#BA7517"
                stroke="none"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {credits.hasPass ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-brown-dark">
                    Trip Pass Active
                  </span>
                  <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ) : (
                <span className="text-sm font-semibold text-brown-dark">
                  {credits.remaining} scans left
                </span>
              )}
            </div>
          </div>
          {credits.hasPass && passExpiry && (
            <p className="text-xs text-brown-medium mt-1 ml-7">
              Expires {passExpiry}
            </p>
          )}
          <button
            onClick={() => setPaywallOpen(true)}
            className="mt-3 w-full py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors active:scale-[0.98]"
          >
            Get More Scans
          </button>
        </div>

        {/* ── Language Settings ── */}
        <div className="bg-cream-dark rounded-xl p-4">
          <h2 className="text-sm font-medium text-brown-medium uppercase tracking-wider mb-2">
            Language
          </h2>

          {/* Output language */}
          <label className="block mb-3">
            <span className="text-xs text-brown-medium mb-1 block">
              I speak
            </span>
            <select
              value={settings.outputLanguage}
              onChange={(e) =>
                save({ ...settings, outputLanguage: e.target.value })
              }
              className="w-full bg-cream border border-brown-light/20 rounded-lg px-3 py-2.5 text-sm text-brown-dark appearance-none focus:outline-none focus:ring-2 focus:ring-coral/30"
            >
              {OUTPUT_LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          {/* Menu language */}
          <label className="block">
            <span className="text-xs text-brown-medium mb-1 block">
              Menu language
            </span>
            <select
              value={settings.menuLanguage}
              onChange={(e) =>
                save({ ...settings, menuLanguage: e.target.value })
              }
              className="w-full bg-cream border border-brown-light/20 rounded-lg px-3 py-2.5 text-sm text-brown-dark appearance-none focus:outline-none focus:ring-2 focus:ring-coral/30"
            >
              {MENU_LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* ── Allergy & Dietary ── */}
        <div className="bg-cream-dark rounded-xl p-4">
          {/* Allergens */}
          <h2 className="text-sm font-medium text-brown-medium uppercase tracking-wider mb-2">
            Allergies
          </h2>
          {settings.allergens.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {settings.allergens.map((a) => {
                const cfg = ALL_ALLERGENS.find((x) => x.value === a);
                return (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-danger text-white px-2.5 py-1 rounded-full"
                  >
                    {cfg?.emoji} {cfg?.label}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-brown-medium/60 mb-2">
              No allergens selected
            </p>
          )}
          <button
            onClick={() => setShowAllergenGrid(!showAllergenGrid)}
            className="text-xs font-medium text-coral hover:text-coral-dark transition-colors"
          >
            {showAllergenGrid ? "Done" : "Edit"}
          </button>

          {showAllergenGrid && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {ALL_ALLERGENS.map((a) => {
                const selected = settings.allergens.includes(a.value);
                return (
                  <button
                    key={a.value}
                    onClick={() => toggleAllergen(a.value)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? "bg-danger text-white ring-2 ring-danger/30"
                        : "bg-cream text-brown-dark hover:bg-brown-light/10"
                    }`}
                  >
                    <span className="text-base">{a.emoji}</span>
                    {a.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Dietary */}
          <div className="mt-4 pt-4 border-t border-brown-light/10">
            <h2 className="text-sm font-medium text-brown-medium uppercase tracking-wider mb-2">
              Dietary Preferences
            </h2>
            {settings.dietary.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {settings.dietary.map((d) => {
                  const cfg = ALL_DIETARY.find((x) => x.value === d);
                  return (
                    <span
                      key={d}
                      className="inline-flex items-center text-xs font-medium bg-success text-white px-2.5 py-1 rounded-full"
                    >
                      {cfg?.label}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-brown-medium/60 mb-2">
                No dietary preferences selected
              </p>
            )}
            <button
              onClick={() => setShowDietaryGrid(!showDietaryGrid)}
              className="text-xs font-medium text-coral hover:text-coral-dark transition-colors"
            >
              {showDietaryGrid ? "Done" : "Edit"}
            </button>

            {showDietaryGrid && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {ALL_DIETARY.map((d) => {
                  const selected = settings.dietary.includes(d.value);
                  return (
                    <button
                      key={d.value}
                      onClick={() => toggleDietary(d.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                        selected
                          ? "bg-success text-white ring-2 ring-success/30"
                          : "bg-cream text-brown-dark hover:bg-brown-light/10"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Account ── */}
        <div className="bg-cream-dark rounded-xl p-4">
          <h2 className="text-sm font-medium text-brown-medium uppercase tracking-wider mb-2">
            Account
          </h2>
          {settings.email ? (
            <>
              <p className="text-sm text-brown-dark">{settings.email}</p>
              <button
                onClick={() => save({ ...settings, email: null })}
                className="mt-2 text-sm font-medium text-coral hover:text-coral-dark transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-brown-medium/60">Not signed in</p>
              <button className="mt-2 text-sm font-medium text-coral hover:text-coral-dark transition-colors">
                Sign In
              </button>
            </>
          )}
        </div>

        {/* ── About ── */}
        <div className="text-center pt-4 pb-4">
          <p className="text-xs text-brown-medium/50 mb-1">
            TransTaste v0.2.0
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-brown-medium/50">
            <button className="hover:text-brown-medium transition-colors underline">
              Terms
            </button>
            <span>/</span>
            <button className="hover:text-brown-medium transition-colors underline">
              Privacy
            </button>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <TripPassPaywall
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
