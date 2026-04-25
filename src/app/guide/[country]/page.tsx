import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/tip-culture-data";
import { t } from "@/lib/i18n/server";

interface Props {
  params: { country: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = COUNTRIES.find(
    (c) => c.code.toLowerCase() === params.country.toLowerCase()
  );
  if (!country) return {};

  const countryName = t(`country.${country.code}.name`);
  const tipNote = t(`country.${country.code}.tipNote`);
  const tipText =
    country.tip.type === "none"
      ? "Tipping is not customary"
      : `Tip ${country.tip.range_min}-${country.tip.range_max}%`;

  return {
    title: `${countryName} Restaurant Guide — Tipping, Etiquette & Dining Tips`,
    description: `Dining guide for ${countryName}: ${tipText}. ${tipNote} Plus dining etiquette, meal times, and essential restaurant phrases.`,
    openGraph: {
      title: `${countryName} Dining Guide — TransTaste`,
      description: `Everything you need to know about eating at restaurants in ${countryName}.`,
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
          <Link href="/" className="hover:text-coral">{t("nav.home")}</Link>
          <span className="mx-1">/</span>
          <Link href="/guide" className="hover:text-coral">{t("guide.breadcrumb")}</Link>
          <span className="mx-1">/</span>
          <span className="text-brown-dark">{t(`country.${country.code}.name`)}</span>
        </nav>

        {/* Header */}
        <h1 className="text-3xl font-bold text-brown-dark mb-2">
          {country.flag} {t("guide.restaurantGuide", { country: t(`country.${country.code}.name`) })}
        </h1>
        <p className="text-sm text-brown-medium mb-8">
          {t("guide.guideSubtitle")}
        </p>

        {/* Tipping */}
        <section className="bg-cream-dark rounded-xl p-4 mb-4">
          <h2 className="text-base font-semibold text-brown-dark mb-2">{t("tipCulture.tipping")}</h2>
          <p className="text-sm text-brown-dark leading-relaxed">{t(`country.${country.code}.tipNote`)}</p>
          {country.tip.type !== "none" && (
            <p className="text-sm text-coral font-medium mt-2">
              {t("guide.recommended", { min: country.tip.range_min, max: country.tip.range_max })}
            </p>
          )}
        </section>

        {/* Restaurant Culture */}
        <section className="bg-cream-dark rounded-xl p-4 mb-4">
          <h2 className="text-base font-semibold text-brown-dark mb-2">{t("tipCulture.restaurantCulture")}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("guide.water")}</dt>
              <dd className="text-brown-dark capitalize">{country.culture.water}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("guide.payment")}</dt>
              <dd className="text-brown-dark">{t("guide.payAt", { location: country.culture.payment_location })}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-brown-medium font-medium min-w-[100px]">{t("guide.tax")}</dt>
              <dd className="text-brown-dark">{country.culture.tax_included ? t("guide.taxIncluded") : t("guide.taxSeparate")}</dd>
            </div>
            {country.culture.side_dishes && (
              <div className="flex gap-2">
                <dt className="text-brown-medium font-medium min-w-[100px]">{t("guide.sideDishes")}</dt>
                <dd className="text-brown-dark">{t("guide.freeRefillable")}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Dining Etiquette */}
        <section className="bg-cream-dark rounded-xl p-4 mb-4">
          <h2 className="text-base font-semibold text-brown-dark mb-2">{t("tipCulture.diningEtiquette")}</h2>
          <p className="text-sm text-brown-dark mb-2">{t(`country.${country.code}.utensilTip`)}</p>
          <p className="text-sm text-brown-medium">
            {t("guide.lunch")}: {country.dining.lunch_hours} · {t("guide.dinner")}: {country.dining.dinner_hours}
          </p>
          {country.dining.time_note && (
            <p className="text-sm text-brown-medium italic mt-1">{t(`country.${country.code}.timeNote`)}</p>
          )}
        </section>

        {/* Good to Know */}
        {country.culture.notes.length > 0 && (
          <section className="bg-cream-dark rounded-xl p-4 mb-6">
            <h2 className="text-base font-semibold text-brown-dark mb-2">{t("tipCulture.goodToKnow")}</h2>
            <ul className="space-y-2">
              {country.culture.notes.map((_, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-brown-dark">
                  <span className="text-coral text-xs mt-1 flex-shrink-0">●</span>
                  {t(`country.${country.code}.notes.${i}`)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="bg-coral/5 rounded-xl p-4 border border-coral/20 text-center">
          <p className="text-sm text-brown-dark mb-3">
            {t("guide.visitCta", { country: t(`country.${country.code}.name`) })}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral-dark transition-colors"
          >
            {t("foods.tryFree")}
          </Link>
        </section>
      </div>
    </main>
  );
}
