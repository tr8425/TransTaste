import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Tools — Phrases, Tips & Dining Guide",
  description:
    "Restaurant phrases in 5 languages, tipping customs for 20+ countries, and dining etiquette guides for international travelers.",
  openGraph: {
    title: "Travel Tools — TransTaste",
    description: "Restaurant phrases, tipping customs & dining etiquette for travelers.",
  },
};

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
