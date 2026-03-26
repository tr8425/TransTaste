"use client";

import { Dish } from "@/lib/types";
import AllergyTag from "./AllergyTag";

interface DishRowProps {
  dish: Dish;
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  main: "bg-coral/20",
  soup: "bg-amber-brand/20",
  noodle: "bg-amber-brand/20",
  rice: "bg-success/20",
  side: "bg-success/20",
  drink: "bg-blue-200",
  dessert: "bg-pink-200",
};

export default function DishRow({ dish, onClick }: DishRowProps) {
  const bgColor = CATEGORY_COLORS[dish.category] || "bg-cream-dark";

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-cream-dark/60 transition-colors active:scale-[0.98]"
    >
      {/* Thumbnail placeholder */}
      <div
        className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}
      >
        <span className="text-lg">
          {dish.category === "main"
            ? "🍖"
            : dish.category === "soup"
            ? "🍲"
            : dish.category === "noodle"
            ? "🍜"
            : dish.category === "drink"
            ? "🍶"
            : dish.category === "dessert"
            ? "🍮"
            : "🍽️"}
        </span>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-brown-dark text-sm tracking-tight truncate">
              {dish.original}
            </p>
            <p className="text-xs text-brown-medium truncate">
              {dish.translation.english}
            </p>
          </div>
          {dish.price && (
            <span className="text-xs font-medium text-amber-brand whitespace-nowrap">
              {dish.price}
            </span>
          )}
        </div>

        {/* Allergen tags */}
        {dish.ingredients.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {dish.ingredients.allergens.map((allergen) => (
              <AllergyTag key={allergen} allergen={allergen} />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
