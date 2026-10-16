"use client";

import { useTranslation } from "@/lib/i18n";

interface AllergyTagProps {
  allergen: string;
  /** True when the tag matches one of the user's own allergens. */
  isUserAllergen?: boolean;
}

const NEUTRAL_COLORS = { bg: "bg-gray-100", text: "text-gray-700" };

export default function AllergyTag({ allergen, isUserAllergen = false }: AllergyTagProps) {
  const { t } = useTranslation();
  // Try to get translated name, fall back to raw allergen name
  const translatedName = t(`allergens.${allergen}`);
  const displayName = translatedName !== `allergens.${allergen}` ? translatedName : allergen;

  if (isUserAllergen) {
    return (
      <span
        className="inline-flex items-center gap-0.5 rounded-full bg-danger px-2.5 py-0.5 text-xs font-bold text-white"
        title={t("dish.yourAllergen")}
      >
        <span aria-hidden>!</span>
        {displayName}
        <span className="sr-only"> ({t("dish.yourAllergen")})</span>
      </span>
    );
  }

  // ALLERGEN_COLORS holds hex values, which never worked as Tailwind classes, so
  // general allergen info stays neutral; only the user's own allergens are red.
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${NEUTRAL_COLORS.bg} ${NEUTRAL_COLORS.text}`}
    >
      {displayName}
    </span>
  );
}
