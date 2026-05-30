"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

/**
 * Syncs <html lang="..."> with the user's resolved locale on the client.
 * SSR keeps lang="en" for a stable first paint; this updates it after hydration
 * so assistive tech and translation tools pick the right language.
 */
export default function HtmlLangSync() {
  const { locale } = useTranslation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!locale) return;
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
