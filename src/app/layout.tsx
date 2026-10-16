import type { Metadata, Viewport } from "next";
import { Archivo_Black, Manrope, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import BottomNav from "@/components/ui/BottomNav";
import CartProvider from "@/components/order/CartProvider";
import HtmlLangSync from "@/components/common/HtmlLangSync";
import ClientTelemetry from "@/components/common/ClientTelemetry";
import "./globals.css";

// Self-hosted fonts: no render-blocking Google Fonts request, metric-matched fallbacks.
const manrope = Manrope({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-manrope" });
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-archivo-black",
});
// CJK faces ship as unicode-range slices; skip preload so only used glyph ranges download.
const notoKr = Noto_Sans_KR({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-noto-kr" });
const notoJp = Noto_Sans_JP({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-noto-jp" });
const fontVars = [manrope.variable, archivoBlack.variable, notoKr.variable, notoJp.variable].join(" ");

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://transtaste.vercel.app");

export const metadata: Metadata = {
  title: {
    default: "TransTaste — Travel Menu Translator",
    template: "%s — TransTaste",
  },
  description:
    "Scan any foreign restaurant menu and instantly understand every dish. Get translations, allergen warnings, flavor profiles, and cultural dining tips.",
  manifest: "/manifest.json",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "TransTaste",
    title: "TransTaste — Travel Menu Translator",
    description:
      "Scan any foreign restaurant menu and instantly understand every dish.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TransTaste — Travel Menu Translator",
    description:
      "Scan any foreign restaurant menu and instantly understand every dish.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TransTaste",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6b2c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TransTaste",
              description:
                "Scan any foreign restaurant menu and instantly understand every dish with translations, allergen warnings, and cultural tips.",
              applicationCategory: "TravelApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "AggregateOffer",
                lowPrice: "0",
                highPrice: "5.99",
                priceCurrency: "USD",
                offerCount: 3,
              },
              featureList: [
                "Menu photo scanning with AI translation",
                "Allergen detection and warnings",
                "Flavor profiles and ingredient lists",
                "Restaurant phrasebook in 5 languages",
                "Tipping and dining etiquette for 20+ countries",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <HtmlLangSync />
        <ClientTelemetry />
        <CartProvider>
          <div className="mobile-container">
            <div className="app-shell">{children}</div>
            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
