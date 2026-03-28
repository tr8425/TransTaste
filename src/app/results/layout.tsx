import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu Analysis Results",
  description:
    "Your translated menu with dish names, prices, allergen warnings, and flavor profiles.",
  robots: { index: false, follow: false },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
