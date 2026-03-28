import { useState, useEffect } from "react";
import en from "./en.json";
import ko from "./ko.json";

const MESSAGES: Record<string, typeof en> = { en, ko };

// Track if we're on client side (avoids hydration mismatch)
const isClient = typeof window !== "undefined";

type NestedKeys<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeys<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeys<typeof en>;

/**
 * Get the user's UI language from localStorage.
 * Falls back to "en" if not set or not supported.
 */
export function getUILocale(): string {
  if (!isClient) return "en";
  try {
    const raw = localStorage.getItem("transtaste_user_settings");
    if (raw) {
      const settings = JSON.parse(raw);
      const lang = settings.output_language;
      if (lang && MESSAGES[lang]) return lang;
    }
  } catch {
    // ignore
  }
  return "en";
}

/**
 * Resolve a dot-notation key from a nested object.
 */
function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

/**
 * Get a translated string by key.
 * Supports {variable} interpolation.
 *
 * Usage:
 *   t("home.heroTitle")
 *   t("loading.found", { count: 5 })
 *   t("tipCulture.noTipBannerDesc", { country: "Japan" })
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  locale?: string,
): string {
  const lang = locale || getUILocale();
  const messages = MESSAGES[lang] || MESSAGES.en;
  let text = resolve(messages as unknown as Record<string, unknown>, key);

  // Fallback to English if key not found in target language
  if (text === key && lang !== "en") {
    text = resolve(MESSAGES.en as unknown as Record<string, unknown>, key);
  }

  // Interpolate {variable} placeholders
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }

  return text;
}

/**
 * Get all supported locales.
 */
export function getSupportedLocales(): string[] {
  return Object.keys(MESSAGES);
}

/**
 * React hook for i18n with hydration-safe behavior.
 * Returns t() that uses "en" on first render (SSR match),
 * then switches to user locale after mount.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   <p>{t("home.heroTitle")}</p>
 */
export function useTranslation() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    setLocale(getUILocale());
  }, []);

  const translate = (
    key: string,
    params?: Record<string, string | number>,
  ): string => t(key, params, locale);

  return { t: translate, locale };
}
