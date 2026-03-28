"use client";

import { ALLERGEN_COLORS } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

interface AllergyTagProps {
  allergen: string;
}

const NEUTRAL_COLORS = { bg: "bg-gray-100", text: "text-gray-700" };

export default function AllergyTag({ allergen }: AllergyTagProps) {
  const { t } = useTranslation();
  const key = allergen.toLowerCase() as keyof typeof ALLERGEN_COLORS;
  const colors = ALLERGEN_COLORS[key] ?? NEUTRAL_COLORS;

  // Try to get translated name, fall back to raw allergen name
  const translatedName = t(`allergens.${allergen}`);
  const displayName = translatedName !== `allergens.${allergen}` ? translatedName : allergen;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {displayName}
    </span>
  );
}
