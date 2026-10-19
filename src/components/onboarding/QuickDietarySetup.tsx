"use client";

import ChoiceChip from "@/components/ui/ChoiceChip";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { trackProductEvent } from "@/lib/product-events";

const SETTINGS_KEY = "transtaste_user_settings";
const DIETARY_OPTIONS = ["vegetarian", "vegan", "halal"] as const;

type DietaryOption = (typeof DIETARY_OPTIONS)[number];

interface StoredSettings {
  output_language?: string;
  home_currency?: string;
  allergen_preset?: string[];
  dietary_beliefs?: string[];
  disliked_ingredients?: string[];
  [key: string]: unknown;
}

function readSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as StoredSettings) : {};
  } catch {
    return {};
  }
}

// Mirrors the server-side cap on disliked ingredients (count and length).
const MAX_DISLIKED_ITEMS = 20;
const MAX_DISLIKED_LENGTH = 60;
const MAX_INPUT_LENGTH = MAX_DISLIKED_ITEMS * (MAX_DISLIKED_LENGTH + 2);

function splitIngredients(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item, index, items) => item.length > 0 && items.indexOf(item) === index);
}

function parseIngredients(value: string): string[] {
  return splitIngredients(value)
    .map((item) => item.slice(0, MAX_DISLIKED_LENGTH))
    .slice(0, MAX_DISLIKED_ITEMS);
}

function exceedsIngredientLimits(value: string): boolean {
  const items = splitIngredients(value);
  return (
    items.length > MAX_DISLIKED_ITEMS ||
    items.some((item) => item.length > MAX_DISLIKED_LENGTH)
  );
}

export default function QuickDietarySetup() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selected, setSelected] = useState<DietaryOption[]>([]);
  const [ingredients, setIngredients] = useState("");
  const [hasSavedPreferences, setHasSavedPreferences] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasScanInput =
      sessionStorage.getItem("scanImage") || sessionStorage.getItem("scanText");

    if (!hasScanInput) {
      router.replace("/");
      return;
    }

    const settings = readSettings();
    const savedDietary = Array.isArray(settings.dietary_beliefs)
      ? settings.dietary_beliefs
      : [];
    const savedIngredients = Array.isArray(settings.disliked_ingredients)
      ? settings.disliked_ingredients
      : [];

    setSelected(
      DIETARY_OPTIONS.filter((option) => savedDietary.includes(option)),
    );
    setIngredients(savedIngredients.join(", "));
    setHasSavedPreferences(
      savedDietary.length > 0 ||
        savedIngredients.length > 0 ||
        (Array.isArray(settings.allergen_preset) &&
          settings.allergen_preset.length > 0),
    );
    setIsReady(true);
  }, [router]);

  const toggleDietary = (option: DietaryOption) => {
    setSelected((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const continueWithPreferences = () => {
    const current = readSettings();
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        ...current,
        output_language: current.output_language || "en",
        home_currency: current.home_currency || "USD",
        dietary_beliefs: selected,
        disliked_ingredients: parseIngredients(ingredients),
      }),
    );
    trackProductEvent("dietary_quick_select", {
      dietary_count: selected.length,
      has_avoided_ingredients: parseIngredients(ingredients).length > 0,
    });
    router.push("/loading-scan");
  };

  if (!isReady) {
    return (
      <div className="min-h-[60dvh]" aria-live="polite">
        <span className="sr-only">{t("quickSetup.loading")}</span>
      </div>
    );
  }

  return (
    <section aria-labelledby="quick-setup-title">
      {hasSavedPreferences ? (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-success/20 bg-success/5 p-3 text-xs leading-5 text-brown-medium">
          <span
            className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-success text-caption font-bold text-white"
            aria-hidden
          >
            ✓
          </span>
          <p>{t("quickSetup.savedPreferences")}</p>
        </div>
      ) : null}

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral">
        {t("quickSetup.eyebrow")}
      </p>
      <h1
        id="quick-setup-title"
        className="mt-2 text-3xl font-bold leading-tight tracking-[-0.03em] text-brown-dark"
      >
        {t("quickSetup.title")}
      </h1>
      <p className="mt-3 text-sm leading-6 text-brown-medium">
        {t("quickSetup.description")}
      </p>

      <fieldset className="mt-7">
        <legend className="mb-3 text-sm font-semibold text-brown-dark">
          {t("quickSetup.dietLegend")}
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          <ChoiceChip
            selected={selected.length === 0}
            onClick={() => setSelected([])}
            className={`min-h-14 rounded-2xl border px-3 text-sm font-semibold ${
              selected.length === 0
                ? "border-coral bg-coral/10 text-coral"
                : "border-brown-light/20 bg-white/60 text-brown-medium hover:border-coral/30"
            }`}
          >
            {t("quickSetup.none")}
          </ChoiceChip>
          {DIETARY_OPTIONS.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <ChoiceChip
                key={option}
                selected={isSelected}
                onClick={() => toggleDietary(option)}
                className={`min-h-14 rounded-2xl border px-3 text-sm font-semibold ${
                  isSelected
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-brown-light/20 bg-white/60 text-brown-medium hover:border-coral/30"
                }`}
              >
                {t(`quickSetup.${option}`)}
              </ChoiceChip>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label
          htmlFor="quick-avoid-ingredients"
          className="text-sm font-semibold text-brown-dark"
        >
          {t("quickSetup.avoidLabel")}
        </label>
        <p className="mt-1 text-xs leading-5 text-brown-medium">
          {t("quickSetup.avoidHint")}
        </p>
        <input
          id="quick-avoid-ingredients"
          type="text"
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          maxLength={MAX_INPUT_LENGTH}
          placeholder={t("quickSetup.avoidPlaceholder")}
          className="mt-3 min-h-12 w-full rounded-2xl border border-brown-light/20 bg-white/70 px-4 text-sm text-brown-dark outline-none transition placeholder:text-brown-medium/45 focus:border-coral focus:ring-2 focus:ring-coral/10"
        />
        {exceedsIngredientLimits(ingredients) ? (
          <p role="status" className="mt-1.5 text-xs leading-5 text-brown-medium">
            {t("quickSetup.avoidLimit", { count: MAX_DISLIKED_ITEMS, chars: MAX_DISLIKED_LENGTH })}
          </p>
        ) : null}
      </div>

      <div className="mt-7 rounded-2xl bg-cream-dark p-3 text-caption leading-5 text-brown-medium">
        {t("quickSetup.safetyNote")}
      </div>

      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={continueWithPreferences}
          className="min-h-14 w-full rounded-2xl bg-coral px-5 text-base font-semibold text-white shadow-lg shadow-coral/20 transition hover:bg-coral-dark active:scale-[0.99]"
        >
          {t("quickSetup.continue")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/loading-scan")}
          className="min-h-11 w-full px-4 text-sm font-medium text-brown-medium transition hover:text-brown-dark"
        >
          {t("quickSetup.skip")}
        </button>
      </div>
    </section>
  );
}
