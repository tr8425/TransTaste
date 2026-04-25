import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | Terms of Service",
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
