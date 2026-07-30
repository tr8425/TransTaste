"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { getProductEvents, trackProductEvent } from "@/lib/product-events";
import {
  PRICING_EXPERIMENT_ID,
  PRICING_EXPERIMENT_PLANS,
  PricingExperimentPlanId,
} from "@/lib/pricing-experiment";

export default function PricingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] =
    useState<PricingExperimentPlanId | null>(null);

  useEffect(() => {
    trackProductEvent("pricing_viewed", {
      source: "results",
      experiment: PRICING_EXPERIMENT_ID,
    });
  }, []);

  const recordInterest = (planId: PricingExperimentPlanId) => {
    const plan = PRICING_EXPERIMENT_PLANS.find(
      (candidate) => candidate.id === planId,
    );
    trackProductEvent("purchase_intent_clicked", {
      plan: planId,
      experiment: PRICING_EXPERIMENT_ID,
      ...(plan ? { days: plan.days, price: plan.price } : {}),
    });
    setSelectedPlan(planId);
  };

  const exportValidationData = () => {
    const blob = new Blob([JSON.stringify(getProductEvents(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `transtaste-validation-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-cream px-5 pb-28 pt-10">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex min-h-11 items-center text-sm font-medium text-brown-medium hover:text-coral"
        >
          ← {t("common.back")}
        </button>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-coral">
          {t("pricing.eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-[-0.03em] text-brown-dark">
          {t("pricing.title")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-brown-medium">
          {t("pricing.description")}
        </p>
        <p className="mt-2 text-xs leading-5 text-brown-medium/75">
          {t("pricing.hypothesisNote")}
        </p>

        <div className="mt-7 space-y-3">
          {PRICING_EXPERIMENT_PLANS.map((plan) => (
            <section
              key={plan.id}
              className={`rounded-2xl border bg-white/70 p-4 ${
                plan.featured ? "border-coral/40 shadow-sm" : "border-brown-light/15"
              }`}
            >
              {plan.featured ? (
                <span className="rounded-full bg-coral/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-coral">
                  {t("pricing.bestForTrip")}
                </span>
              ) : null}
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-brown-dark">{t(plan.titleKey)}</h2>
                  <p className="mt-1 text-xs leading-5 text-brown-medium">{t(plan.descriptionKey)}</p>
                </div>
                <p className="flex-none text-xl font-bold text-brown-dark">{plan.price}</p>
              </div>
              <button
                type="button"
                onClick={() => recordInterest(plan.id)}
                aria-pressed={selectedPlan === plan.id}
                className="mt-4 min-h-12 w-full rounded-xl bg-brown-dark px-4 text-sm font-semibold text-white transition hover:bg-brown-medium"
              >
                {selectedPlan === plan.id ? t("pricing.interestRecorded") : t("pricing.interested")}
              </button>
            </section>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-cream-dark p-4 text-xs leading-5 text-brown-medium">
          <p className="font-semibold text-brown-dark">{t("pricing.validationOnly")}</p>
          <p className="mt-1">{t("pricing.validationOnlyDesc")}</p>
        </div>

        <button
          type="button"
          onClick={exportValidationData}
          className="mt-4 min-h-11 w-full text-xs font-semibold text-brown-medium underline underline-offset-4 hover:text-brown-dark"
        >
          {t("pricing.exportData")}
        </button>
      </div>
    </main>
  );
}
