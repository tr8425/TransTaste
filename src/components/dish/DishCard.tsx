"use client";

import { DishLite, DishDetail } from "@/lib/types";
import BottomSheet from "@/components/ui/BottomSheet";
import AllergyTag from "./AllergyTag";
import IngredientChip from "./IngredientChip";
import FlavorRadar from "./FlavorRadar";
import FunFactCard from "@/components/common/FunFactCard";
import LockedBlock from "@/components/common/LockedBlock";

interface DishCardProps {
  dish: DishLite | null;
  detail: DishDetail | null;
  isDetailLoading: boolean;
  detailError: string | null;
  onRetryDetail?: () => void;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked?: boolean;
  onUnlock?: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  main: "from-coral/30 to-amber-brand/20",
  soup: "from-amber-brand/30 to-coral/10",
  noodle: "from-amber-brand/20 to-cream-dark",
  drink: "from-blue-200 to-cream-dark",
  dessert: "from-pink-200 to-cream-dark",
};

function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-3 w-20 bg-cream-dark rounded mb-3" />
        <div className="flex justify-center">
          <div className="w-[140px] h-[140px] bg-cream-dark rounded-full" />
        </div>
      </div>
      <div>
        <div className="h-3 w-16 bg-cream-dark rounded mb-2" />
        <div className="flex gap-1.5">
          <div className="h-6 w-16 bg-cream-dark rounded-full" />
          <div className="h-6 w-20 bg-cream-dark rounded-full" />
          <div className="h-6 w-14 bg-cream-dark rounded-full" />
        </div>
      </div>
      <div className="h-16 bg-cream-dark rounded-xl" />
    </div>
  );
}

export default function DishCard({
  dish,
  detail,
  isDetailLoading,
  detailError,
  onRetryDetail,
  isOpen,
  onClose,
  isUnlocked = false,
  onUnlock,
  onAddToCart,
  isInCart,
}: DishCardProps) {
  if (!dish) return null;

  const gradient =
    CATEGORY_GRADIENTS[dish.category] || "from-cream-dark to-cream";

  // Render detail section (Phase 2 data)
  const renderDetail = () => {
    if (isDetailLoading) {
      return <DetailSkeleton />;
    }

    if (detailError) {
      return (
        <div className="text-center py-6">
          <p className="text-sm text-brown-medium mb-2">Could not load details</p>
          {onRetryDetail && (
            <button
              onClick={onRetryDetail}
              className="text-sm text-coral font-medium hover:underline"
            >
              Tap to retry
            </button>
          )}
        </div>
      );
    }

    if (!detail) return null;

    return (
      <>
        {/* Flavor Radar */}
        <div className="mb-4">
          <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-3">
            Flavor Profile
          </h3>
          <div className="flex justify-center">
            <FlavorRadar profile={detail.flavor_profile} size={140} />
          </div>
        </div>

        {/* Core ingredients */}
        {detail.ingredients?.core && detail.ingredients.core.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-2">
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {detail.ingredients.core.map((ingredient) => (
                <IngredientChip
                  key={ingredient}
                  name={ingredient}
                  isAllergen={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fun Fact */}
        {(detail.fun_fact || detail.warning) && (
          <div className="mb-4">
            <FunFactCard
              fact={detail.fun_fact}
              dishName={dish.original}
              detail={detail.fun_fact_detail}
              warning={detail.warning}
            />
          </div>
        )}

        {/* How to eat */}
        {detail.how_to_eat && (
          <div className="mb-4">
            <div className="bg-cream-dark rounded-xl p-4 border-l-4 border-l-coral">
              <h4 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-1">
                How to Eat
              </h4>
              <p className="text-sm text-brown-dark leading-relaxed">
                {detail.how_to_eat}
              </p>
            </div>
          </div>
        )}

        {/* Disclosure — cultural context note */}
        {detail.disclosure && (
          <div className="mb-4">
            <div className="bg-brown-dark/5 rounded-xl p-4 border-l-4 border-l-brown-medium">
              <h4 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-1">
                Cultural Note
              </h4>
              <p className="text-sm text-brown-dark leading-relaxed">
                {detail.disclosure.message}
              </p>
            </div>
          </div>
        )}
      </>
    );
  };

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

      {/* Name & translations — Phase 1 data, instant */}
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

      {/* Price & category — Phase 1 data */}
      <div className="flex items-center gap-2 mb-4">
        {(dish.price_display || dish.price) && (
          <span className="text-sm font-semibold text-amber-brand bg-amber-brand/10 px-2.5 py-0.5 rounded-full">
            {dish.price_display || dish.price}
          </span>
        )}
        <span className="text-xs text-brown-medium bg-cream-dark px-2 py-0.5 rounded-full capitalize">
          {dish.price_tier}
        </span>
        <span className="text-xs text-brown-medium bg-cream-dark px-2 py-0.5 rounded-full capitalize">
          {dish.category}
        </span>
      </div>

      {/* Allergens & dietary — Phase 1 data */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-2">
          Allergens & Dietary
        </h3>

        {/* Risk-level action guide */}
        {dish.allergen_risk === "danger" && (
          <div className="flex items-start gap-2 mb-2.5 p-2.5 bg-danger/10 rounded-lg border border-danger/20">
            <span className="text-sm flex-shrink-0">{"❌"}</span>
            <p className="text-xs text-danger font-medium leading-relaxed">
              Contains your allergen. Consider an alternative dish.
            </p>
          </div>
        )}
        {dish.allergen_risk === "warning" && (
          <div className="flex items-start gap-2 mb-2.5 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <span className="text-sm flex-shrink-0">{"⚠️"}</span>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              May contain allergens. Ask staff if it can be prepared without.
            </p>
          </div>
        )}
        {dish.allergen_risk === "check" && (
          <div className="flex items-start gap-2 mb-2.5 p-2.5 bg-amber-brand/10 rounded-lg border border-amber-brand/20">
            <span className="text-sm flex-shrink-0">{"〰️"}</span>
            <p className="text-xs text-amber-brand font-medium leading-relaxed">
              Possible allergen presence. Ask staff to confirm ingredients.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {dish.allergens?.map((allergen) => (
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

        {/* Disliked ingredients warning */}
        {dish.disliked_ingredients && dish.disliked_ingredients.length > 0 && (
          <div className="flex items-start gap-2 mt-2.5 p-2.5 bg-brown-medium/10 rounded-lg">
            <span className="text-sm flex-shrink-0">{"😐"}</span>
            <p className="text-xs text-brown-dark leading-relaxed">
              Contains ingredients you dislike: <strong>{dish.disliked_ingredients.join(", ")}</strong>
            </p>
          </div>
        )}

        <p className="text-[10px] text-brown-medium/40 mt-2 leading-relaxed">
          AI-generated info for reference only. Confirm allergens with restaurant staff.
        </p>
      </div>

      <hr className="border-brown-light/10 my-4" />

      {/* Phase 2 detail section */}
      {isUnlocked ? (
        renderDetail()
      ) : (
        <div className="space-y-3">
          <LockedBlock showIcon={true}>
            {detail ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-3">
                    Flavor Profile
                  </h3>
                  <div className="flex justify-center py-2">
                    <FlavorRadar profile={detail.flavor_profile} size={140} />
                  </div>
                </div>
                {detail.fun_fact && (
                  <FunFactCard
                    fact={detail.fun_fact}
                    dishName={dish.original}
                    detail={detail.fun_fact_detail}
                    warning={detail.warning}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <div>
                  <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-3">
                    Flavor Profile
                  </h3>
                  <div className="flex justify-center py-2">
                    <FlavorRadar
                      profile={{ sweet: 3, salty: 4, spicy: 2, sour: 1, umami: 5, rich: 3 }}
                      size={140}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-2">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["Main ingredient", "Seasoning", "Spice"].map((name) => (
                      <IngredientChip key={name} name={name} isAllergen={false} />
                    ))}
                  </div>
                </div>
                <div className="bg-cream-dark rounded-xl p-4">
                  <h4 className="text-xs font-medium text-brown-medium uppercase tracking-wider mb-1">
                    Fun Fact
                  </h4>
                  <p className="text-sm text-brown-dark leading-relaxed">
                    Unlock to discover the story behind this dish, how to eat it, and more.
                  </p>
                </div>
              </div>
            )}
          </LockedBlock>

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

      {/* Add to Order button */}
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          className={`w-full mt-4 py-3 font-semibold rounded-xl transition-colors border-2 ${
            isInCart
              ? "border-coral bg-coral/10 text-coral"
              : "border-coral text-coral hover:bg-coral/10"
          }`}
        >
          {isInCart ? "Added \u2713" : "Add to Order"}
        </button>
      )}
    </BottomSheet>
  );
}
