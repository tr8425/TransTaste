import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/ui/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "TransTaste",
  description: "Scan menus, understand dishes — your travel food guide",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TransTaste",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D85A30",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mobile-container">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
