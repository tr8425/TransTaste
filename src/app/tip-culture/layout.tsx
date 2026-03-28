import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipping & Dining Etiquette Guide — 20+ Countries",
  description:
    "Tipping customs, dining etiquette, meal times, and restaurant culture for Japan, Korea, Thailand, Vietnam, USA, and 15+ more countries.",
  openGraph: {
    title: "Tipping & Dining Guide — TransTaste",
    description: "Know when to tip, how to eat, and what to expect in 20+ countries.",
  },
};

export default function TipCultureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
