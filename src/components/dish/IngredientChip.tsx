"use client";

interface IngredientChipProps {
  name: string;
  isAllergen?: boolean;
}

export default function IngredientChip({ name, isAllergen = false }: IngredientChipProps) {
  const baseClasses = "rounded-lg px-3 py-1 text-sm";

  const variantClasses = isAllergen
    ? "bg-red-50 text-danger border border-danger/30"
    : "bg-cream-dark text-brown-dark border border-transparent";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {name}
    </span>
  );
}
