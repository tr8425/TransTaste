/**
 * Server-safe i18n utilities.
 * Use this import in Server Components (no React hooks).
 *
 * Usage:
 *   import { t } from "@/lib/i18n/server";
 *   <p>{t("home.heroTitle")}</p>
 */
import en from "./en.json";
import ko from "./ko.json";

const MESSAGES: Record<string, typeof en> = { en, ko };

function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

export function t(
  key: string,
  params?: Record<string, string | number>,
  locale?: string,
): string {
  const lang = locale || "en";
  const messages = MESSAGES[lang] || MESSAGES.en;
  let text = resolve(messages as unknown as Record<string, unknown>, key);

  if (text === key && lang !== "en") {
    text = resolve(MESSAGES.en as unknown as Record<string, unknown>, key);
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }

  return text;
}
