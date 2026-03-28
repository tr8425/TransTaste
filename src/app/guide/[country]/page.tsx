import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/tip-culture-data";

interface Props {
  params: { country: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = COUNTRIES.find(
    (c) => c.code.toLowerCase() === params.country.toLowerCase()
  );
  if (!country) return {};

  const tipText =
    country.tip.type === "none"
      ? "Tipping is not customary"
      : `Tip ${country.tip.range_min}-${country.tip.range_max}%`;

  return {
    title: `${country.name} Restaurant Guide — Tipping, Etiquette & Dining Tips`,
    description: `Dining guide for ${country.name}: ${tipText}. ${country.tip.note} Plus dining etiquette, meal times, and essential restaurant phrases.`,
    openGraph: {
      title: `${country.name} Dining Guide — TransTaste`,
      description: `Everything you need to know about eating at restaurants in ${country.name}.`,
    },
  };
}

export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.code.toLowerCase() }));
}

export default function CountryGuidePage({ params }: Props) {
  const country = COUNTRIES.find(
    (c) => c.code.toLowerCase() === params.country.toLowerCase()
  );
  if (!country) notFound();

  return (
    <main className="min-h-screen bg-cream pb-28">
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-brown-medium mb-6">
          <Link href="/" className="hover:text-coral">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/guide" className="hover:text-coral">Guides</Link>
          <span className="mx-1">/</span>
          <span className="text-brown-dark">{country.name}</span>
        </nav>

        {/* Header */}
        <h1 className="text-3xl font-bold text-brown-dark mb-2">
          {country.flag} {country.name} Restaurant Guide
        </h1>
        <p className="text-sm text-brown-medium mb-8">
          Tipping customs, dining etiquette, and restaurant tips for travelers
        </p>

        {/* Tipping */}
        <section className="bg-cream-dark rounded-xl p-4 mb-4">
          <h2 className="text-base font-semibold text-brown-dark mb-2">Tipping</h2>
          <p className="text-sm text-brown-dark leading-relaxed">{country.tip.note}</p>
          {country.tip.type !== "none" && (
            <p className="text-sm text-coral font-medium mt-2">
              Recommended: {country.tip.range_min}–{country.tip.range_max}%
            </p>
          )}
        </section>

        {/* Restaurant Culture */}
        <section className="bg-cream-dark rounded-xl p-4 mb-4">
          <h2 className="text-base font-semibold text-brown-dark mb-2">Restaurant Culture</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">Water</dt>
              <dd className="text-brown-dark capitalize">{country.culture.water}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">Payment</dt>
              <dd className="text-brown-dark">Pay at {country.culture.payment_location}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">Tax</dt>
              <dd className="text-brown-dark">{country.culture.tax_included ? "Included in price" : "Added separately"}</dd>
            </div>
            {country.culture.side_dishes && (
              <div className="flex gap-2">
                <dt className="text-brown-medium font-medium min-w-[100px]">Side dishes</dt>
                <dd className="text-brown-dark">Free and refillable</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Dining Etiquette */}
        <section className="bg-cream-dark rounded-xl p-4 mb-4">
          <h2 className="text-base font-semibold text-brown-dark mb-2">Dining Etiquette</h2>
          <p className="text-sm text-brown-dark mb-2">{country.dining.utensil_tip}</p>
          <p className="text-sm text-brown-medium">
            Lunch: {country.dining.lunch_hours} · Dinner: {country.dining.dinner_hours}
          </p>
          {country.dining.time_note && (
            <p className="text-sm text-brown-medium italic mt-1">{country.dining.time_note}</p>
          )}
        </section>

        {/* Good to Know */}
        {country.culture.notes.length > 0 && (
          <section className="bg-cream-dark rounded-xl p-4 mb-6">
            <h2 className="text-base font-semibold text-brown-dark mb-2">Good to Know</h2>
            <ul className="space-y-2">
              {country.culture.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-brown-dark">
                  <span className="text-coral text-xs mt-1 flex-shrink-0">●</span>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="bg-coral/5 rounded-xl p-4 border border-coral/20 text-center">
          <p className="text-sm text-brown-dark mb-3">
            Visiting {country.name}? Scan any restaurant menu with TransTaste to get
            instant translations, allergen warnings, and ordering phrases.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors"
          >
            Try TransTaste Free
          </Link>
        </section>
      </div>
    </main>
  );
}
