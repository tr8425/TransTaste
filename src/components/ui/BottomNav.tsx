"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

const HIDDEN_ROUTES = ["/camera", "/loading-scan", "/order/present", "/onboarding"];

interface Tab {
  href: string;
  labelKey: string;
  isCta?: boolean;
  icon: (active: boolean) => React.ReactNode;
}

const TABS: Tab[] = [
  {
    href: "/",
    labelKey: "nav.home",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        {!active && <path d="M9 21V12h6v9" />}
      </svg>
    ),
  },
  {
    href: "/travel",
    labelKey: "nav.travel",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
      </svg>
    ),
  },
  {
    href: "/camera",
    labelKey: "nav.scan",
    isCta: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    href: "/history",
    labelKey: "nav.history",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? "2" : "1.5"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/profile",
    labelKey: "nav.profile",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  // SSR / pre-hydration: render the shell without labels so users never see
  // the en-locked text flash before the client-side locale resolves.
  if (!mounted) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center" aria-hidden>
        <div className="w-full max-w-mobile bg-cream/95 backdrop-blur-md border-t border-brown-light/10 px-3 pb-6 pt-2">
          <div className="flex items-center justify-around h-[52px]" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <div className="w-full max-w-mobile bg-cream/95 backdrop-blur-md border-t border-brown-light/10 px-3 pb-6 pt-2">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;

            if (tab.isCta) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-label={t(tab.labelKey)}
                  className="w-14 h-14 -mt-5 rounded-full bg-coral shadow-lg shadow-coral/25 flex items-center justify-center hover:bg-coral-dark transition-colors active:scale-95"
                >
                  {tab.icon(false)}
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-1 px-1 transition-colors ${
                  isActive ? "text-coral" : "text-brown-medium/60 hover:text-brown-medium"
                }`}
              >
                {tab.icon(isActive)}
                <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
