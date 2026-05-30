import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | 자주 묻는 질문",
  description:
    "TransTaste — pricing, allergen reliability, supported languages, offline behavior, and how to use your own API key.",
  robots: { index: true, follow: true },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
