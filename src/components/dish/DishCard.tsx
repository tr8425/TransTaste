"use client";

import { Dish } from "@/lib/types";
import BottomSheet from "@/components/ui/BottomSheet";
import AllergyTag from "./AllergyTag";
import IngredientChip from "./IngredientChip";
import FlavorRadar from "./FlavorRadar";
import FunFactCard from "@/components/common/FunFactCard";
import LockedBlock from "@/components/common/LockedBlock";

interface DishCardProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked?: boolean;
  onUnlock?: () => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  main: "from-coral/30 to-amber-brand/20",
  soup: "from-amber-brand/30 to-coral/10",
  noodle: "from-amber-brand/20 to-cream-dark",
  drink: "from-blue-200 to-cream-dark",
  dessert: "from-pink-200 to-cream-dark",
};

export default function DishCard({
  dish,
  isOpen,
  onClose,
  isUnlocked = false,
  onUnlock,
}: DishCardProps) {
  if (!dish) return null;

  const gradient =
    CATEGORY_GRADIENTS[dish.category] || "from-cream-dark to-cream";

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* Hero */}
      <div
        className={`-mx-5 -mt-2 h-48 bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}
      >
        <span className="text-5xl">
          {dish.category === "main"
            ? "🍖"
            : dish.category === "soup"
            ? "🍲"
            : dish.category === "noodle"
            ? "🍜"
            : dish.category === "drink"
            ? "🍶"
            : "🍽️"}
        </span>
      </div>

      {/* Name & translations */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-brown-dark tracking-tight mb-1">
          {dish.original}
        </h2>
        <p className="text-sm text-brown-medium italic mb-0.5">
          &ldquo;{dish.translation.literal}&rdquo;
        </p>
        <p className="text-base font-medium text-brown-dark">
          {dish.translation.meaning}
        </p>
        <p className="text-sm text-coral font-semibold mt-1">
          {dish.translation.english}
        </p>
      </div>

      {/* Price & confidence */}
      <div className="flex items-center gap-2 mb-4">
        {dish.price && (
          <span className="text-sm font-semibold text-amber-brand bg-amber-brand/10 px-2.5 py-0.5 rounded-full">
            {dish.price}
          </span>
        )}
        <span className="text-xs text-brown-medium bg-cream-dark px-2 py-0.5 rounded-full capitalize">
          {dish.price_tier}
        </span>
        <span className="text-xs text-brown-medium bg-cream-dark px-2 py-0.5 rounded-full capitalize">
          {dish.category}
        </span>
      </div>

      {/* Core ingredients */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-2">
          Ingredients
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {dish.ingredients.core.map((ingredient) => (
            <IngredientChip
              key={ingredient}
              name={ingredient}
              isAllergen={false}
            />
          ))}
        </div>
      </div>

      {/* Allergens & dietary */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-2">
          Allergens & Dietary
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {dish.ingredients.allergens.map((allergen) => (
            <AllergyTag key={allergen} allergen={allergen} />
          ))}
          {dish.dietary.vegan && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-success">
              Vegan
            </span>
          )}
          {dish.dietary.vegetarian && !dish.dietary.vegan && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-success">
              Vegetarian
            </span>
          )}
          {dish.dietary.halal && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-success">
              Halal
            </span>
          )}
        </div>
      </div>

      <hr className="border-brown-light/10 my-4" />

      {isUnlocked ? (
        <>
          {/* Flavor Radar */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-3">
              Flavor Profile
            </h3>
            <div className="flex justify-center">
              <FlavorRadar profile={dish.flavor_profile} size={140} />
            </div>
          </div>

          {/* Fun Fact */}
          <div className="mb-4">
            <FunFactCard fact={dish.fun_fact} dishName={dish.original} />
          </div>

          {/* How to eat */}
          {dish.how_to_eat && (
            <div className="mb-4">
              <div className="bg-cream-dark rounded-xl p-4 border-l-4 border-l-coral">
                <h4 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-1">
                  How to Eat
                </h4>
                <p className="text-sm text-brown-dark leading-relaxed">
                  {dish.how_to_eat}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Locked group — single blur block with one CTA */
        <div className="space-y-3">
          <LockedBlock showIcon={false}>
            <div className="space-y-4">
              {/* Flavor Radar preview */}
              <div>
                <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-3">
                  Flavor Profile
                </h3>
                <div className="flex justify-center py-2">
                  <FlavorRadar profile={dish.flavor_profile} size={140} />
                </div>
              </div>

              {/* Fun Fact preview */}
              <FunFactCard fact={dish.fun_fact} dishName={dish.original} />

              {/* How to eat preview */}
              {dish.how_to_eat && (
                <div className="bg-cream-dark rounded-xl p-4 border-l-4 border-l-coral">
                  <h4 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-1">
                    How to Eat
                  </h4>
                  <p className="text-sm text-brown-dark leading-relaxed">
                    {dish.how_to_eat}
                  </p>
                </div>
              )}
            </div>
          </LockedBlock>

          {/* Single unified CTA */}
          <button
            onClick={onUnlock}
            className="w-full py-3.5 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>
            Unlock flavors, facts & more — $2.99
          </button>
          <p className="text-center text-xs text-brown-medium/60">
            7-Day Trip Pass &middot; One-time payment
          </p>
        </div>
      )}
    </BottomSheet>
  );
}
