"use client";

import { ALLERGEN_COLORS } from "@/lib/constants";

interface AllergyTagProps {
  allergen: string;
}

const NEUTRAL_COLORS = { bg: "bg-gray-100", text: "text-gray-700" };

export default function AllergyTag({ allergen }: AllergyTagProps) {
  const key = allergen.toLowerCase() as keyof typeof ALLERGEN_COLORS;
  const colors = ALLERGEN_COLORS[key] ?? NEUTRAL_COLORS;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
    >
      {allergen}
    </span>
  );
}
