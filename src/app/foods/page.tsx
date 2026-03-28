import { Metadata } from "next";
import Link from "next/link";
import { FOOD_DATABASE } from "@/lib/food-database";

export const metadata: Metadata = {
  title: "Food Guide — Popular Dishes Explained",
  description:
    "Explore popular dishes from around the world. Translations, allergen info, ingredients, fun facts, and how to eat guides for travelers.",
  openGraph: {
    title: "Food Guide — TransTaste",
    description: "Understand popular dishes before you travel. Allergens, ingredients, and cultural context.",
  },
};

export default function FoodsIndexPage() {
  const foods = Object.values(FOOD_DATABASE);

  return (
    <main className="min-h-screen bg-cream pb-28">
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        <h1 className="text-2xl font-bold text-brown-dark mb-2">Food Guide</h1>
        <p className="text-sm text-brown-medium mb-8">
          Popular dishes explained — translations, allergens, ingredients & cultural context
        </p>

        <div className="space-y-3">
          {foods.map((food) => (
            <Link
              key={food.slug}
              href={`/foods/${food.slug}`}
              className="flex items-center gap-4 bg-cream-dark rounded-xl p-4 hover:bg-brown-light/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-brown-dark">{food.english}</p>
                <p className="text-sm text-brown-medium">{food.original} · {food.cuisine}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-brown-medium mb-3">
            At a restaurant right now? Scan the menu for instant info.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors"
          >
            Scan a Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
