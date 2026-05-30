import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurant Phrasebook — 8 Languages",
  description:
    "Essential restaurant phrases in Japanese, Chinese, Thai, Vietnamese, Spanish, French, Italian, and English. Pronunciation guides and expected server responses included.",
  openGraph: {
    title: "Restaurant Phrasebook — TransTaste",
    description: "50+ restaurant phrases in 8 languages with pronunciation guides.",
  },
};

export default function PhrasesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
