"use client";

import { DishLite } from "@/lib/types";
import AllergyTag from "./AllergyTag";

interface DishRowProps {
  dish: DishLite;
  onClick: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
}

const RISK_BADGE: Record<string, { label: string; className: string } | null> = {
  danger: { label: "Allergen", className: "bg-danger text-white" },
  warning: { label: "Check", className: "bg-amber-500 text-white" },
  check: { label: "Ask staff", className: "bg-amber-brand/20 text-amber-brand" },
  safe: null,
};

const CATEGORY_COLORS: Record<string, string> = {
  main: "bg-coral/20",
  soup: "bg-amber-brand/20",
  noodle: "bg-amber-brand/20",
  rice: "bg-success/20",
  side: "bg-success/20",
  drink: "bg-blue-200",
  dessert: "bg-pink-200",
};

export default function DishRow({ dish, onClick, onAddToCart, isInCart }: DishRowProps) {
  const bgColor = CATEGORY_COLORS[dish.category] || "bg-cream-dark";
  const riskBadge = dish.allergen_risk ? RISK_BADGE[dish.allergen_risk] : null;

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
          {(dish.price_display || dish.price) && (
            <span className="text-xs font-medium text-amber-brand whitespace-nowrap">
              {dish.price_display || dish.price}
            </span>
          )}
        </div>

        {/* Allergen risk badge + tags */}
        {dish.allergens?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {riskBadge && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${riskBadge.className}`}>
                {riskBadge.label}
              </span>
            )}
            {dish.allergens?.map((allergen) => (
              <AllergyTag key={allergen} allergen={allergen} />
            ))}
          </div>
        )}
      </div>

      {/* Add to cart button */}
      {onAddToCart && (
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onAddToCart();
            }
          }}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 self-center transition-colors ${
            isInCart
              ? "bg-coral border-coral"
              : "border-coral hover:bg-coral/10"
          }`}
        >
          {isInCart ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span className="text-coral text-lg font-medium leading-none">+</span>
          )}
        </div>
      )}
    </button>
  );
}
