export const PRICING_EXPERIMENT_ID = "trip_pass_v1";

export const PRICING_EXPERIMENT_PLANS = [
  {
    id: "pass_3d",
    days: 3,
    price: "$1.99",
    titleKey: "pricing.pass3d",
    descriptionKey: "pricing.pass3dDesc",
    featured: false,
  },
  {
    id: "pass_7d",
    days: 7,
    price: "$3.99",
    titleKey: "pricing.pass7d",
    descriptionKey: "pricing.pass7dDesc",
    featured: true,
  },
  {
    id: "pass_30d",
    days: 30,
    price: "$9.99",
    titleKey: "pricing.pass30d",
    descriptionKey: "pricing.pass30dDesc",
    featured: false,
  },
] as const;

export type PricingExperimentPlanId =
  (typeof PRICING_EXPERIMENT_PLANS)[number]["id"];
