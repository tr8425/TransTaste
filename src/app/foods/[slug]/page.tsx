import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FOOD_DATABASE, type FoodEntry } from "@/lib/food-database";
import { t } from "@/lib/i18n/server";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const food = FOOD_DATABASE[params.slug];
  if (!food) return {};

  return {
    title: `${food.english} (${food.original}) — What Is It?`,
    description: `${food.english}: ${food.description}. Allergens: ${food.allergens.join(", ") || "none known"}. Learn what it is, how to eat it, and what to watch out for.`,
    openGraph: {
      title: `${food.english} — TransTaste Food Guide`,
      description: food.description,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(FOOD_DATABASE).map((slug) => ({ slug }));
}

export default function FoodPage({ params }: Props) {
  const food: FoodEntry | undefined = FOOD_DATABASE[params.slug];
  if (!food) notFound();

  return (
    <main className="min-h-screen bg-cream pb-28">
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-brown-medium mb-6">
          <Link href="/" className="hover:text-coral">{t("nav.home")}</Link>
          <span className="mx-1">/</span>
          <Link href="/foods" className="hover:text-coral">{t("foods.title")}</Link>
          <span className="mx-1">/</span>
          <span className="text-brown-dark">{food.english}</span>
        </nav>

        {/* Header */}
        <p className="mengto-kicker mb-2 text-[9px] font-extrabold text-coral">Dish field note</p>
        <h1 className="mb-1 text-4xl font-bold text-brown-dark">{food.english}</h1>
        <p className="text-xl text-brown-medium mb-4">{food.original}</p>

        {/* Description */}
        <section className="mb-6">
          <p className="text-sm text-brown-dark leading-relaxed">{food.description}</p>
        </section>

        {/* Quick facts */}
        <section className="bg-cream-dark rounded-xl p-4 mb-6">
          <h2 className="text-sm font-semibold text-brown-dark mb-3">{t("foods.quickFacts")}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("foods.cuisine")}</dt>
              <dd className="text-brown-dark">{food.cuisine}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("foods.category")}</dt>
              <dd className="text-brown-dark capitalize">{food.category}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("foods.keyIngredients")}</dt>
              <dd className="text-brown-dark">{food.ingredients.join(", ")}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("foods.allergens")}</dt>
              <dd className="text-brown-dark">{food.allergens.length > 0 ? food.allergens.join(", ") : t("foods.noneKnown")}</dd>
            </div>
          </dl>
        </section>

        {/* Fun fact */}
        {food.fun_fact && (
          <section className="bg-amber-brand/10 rounded-xl p-4 mb-6 border border-amber-brand/20">
            <h2 className="text-xs font-semibold text-amber-brand mb-1">{t("foods.didYouKnow")}</h2>
            <p className="text-sm text-brown-dark leading-relaxed">{food.fun_fact}</p>
          </section>
        )}

        {/* How to eat */}
        {food.how_to_eat && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-brown-dark mb-2">{t("foods.howToEat")}</h2>
            <p className="text-sm text-brown-medium leading-relaxed">{food.how_to_eat}</p>
          </section>
        )}

        {/* CTA */}
        <section className="bg-coral/5 rounded-xl p-4 border border-coral/20 text-center">
          <p className="text-sm text-brown-dark mb-3">
            {t("foods.scanCta", { dish: food.english })}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors"
          >
            {t("foods.tryFree")}
          </Link>
        </section>

        {/* Disclaimer */}
        <p className="mt-6 text-[10px] text-brown-medium/40 leading-relaxed">
          {t("foods.infoDisclaimer")}
        </p>
      </div>
    </main>
  );
}
