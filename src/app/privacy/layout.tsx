import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Privacy Policy",
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
