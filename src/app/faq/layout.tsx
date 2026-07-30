import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | 자주 묻는 질문",
  description:
    "TransTaste — product-validation pricing, allergen reliability, supported languages, privacy, and offline behavior.",
  robots: { index: true, follow: true },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
