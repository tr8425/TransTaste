"use client";

import { useState, useEffect, useMemo } from "react";
import { PHRASE_CATEGORIES, PHRASES, type Phrase } from "@/lib/phrases";
import { ALLERGEN_INGREDIENT_NAMES } from "@/lib/allergen-i18n";
import { useTranslation } from "@/lib/i18n";
import HorizontalScroll from "@/components/ui/HorizontalScroll";

const LANGUAGES = [
  { code: "ja", labelKey: "phrases.langJa" },
  { code: "zh", labelKey: "phrases.langZh" },
  { code: "th", labelKey: "phrases.langTh" },
  { code: "vi", labelKey: "phrases.langVi" },
  { code: "es", labelKey: "phrases.langEs" },
  { code: "fr", labelKey: "phrases.langFr" },
  { code: "it", labelKey: "phrases.langIt" },
  { code: "en", labelKey: "phrases.langEn" },
] as const;

type CategoryId = (typeof PHRASE_CATEGORIES)[number]["id"] | "favorites";
type LangCode = (typeof LANGUAGES)[number]["code"];

const FAVORITES_KEY = "transtaste_favorite_phrases";

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveFavorites(favs: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
}

function PhraseCard({
  phrase,
  targetLang,
  userLang,
  isFavorite,
  onToggleFavorite,
}: {
  phrase: Phrase;
  targetLang: LangCode;
  userLang: string;
  isFavorite: boolean;
  onToggleFavorite: (key: string) => void;
}) {
  const { t } = useTranslation();
  const translation = phrase.translations[targetLang];
  const responses = phrase.expectedResponses?.[targetLang] ?? [];

  // Determine the "user side" text
  const userText =
    userLang === "ko"
      ? phrase.ko
      : phrase.translations[userLang]?.text ?? phrase.translations.en?.text ?? phrase.ko;

  if (!translation) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* User language */}
      <p className="text-sm text-brown-dark mb-1">{userText}</p>

      {/* Target language */}
      <p className="text-lg font-bold text-brown-dark leading-snug">
        {translation.text}
      </p>

      {/* Pronunciation */}
      <p className="text-sm italic text-brown-medium mt-0.5">
        {translation.pronunciation}
      </p>

      {/* Responses */}
      {responses.length > 0 && (
        <>
          <div className="border-t border-brown-light/20 my-3" />
          <p className="text-xs font-medium text-brown-medium mb-2">
            {t("phrases.serverMightSay")}
          </p>
          <div className="flex flex-wrap gap-2">
            {responses.map((r, i) => (
              <button
                key={i}
                className="bg-cream-dark rounded-xl px-4 py-2 text-left active:scale-[0.97] transition-transform"
              >
                <span className="text-sm font-medium text-brown-dark block leading-snug">
                  {r.text}
                </span>
                <span className="text-xs text-brown-medium">({r.meaning})</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Bookmark */}
      <div className="flex justify-end mt-3">
        <button
          onClick={() => onToggleFavorite(phrase.key)}
          className="text-brown-light hover:text-coral transition-colors"
          aria-label={isFavorite ? t("phrases.removeBookmark") : t("phrases.bookmarkPhrase")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function PhrasesPage() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>("ja");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("basic");
  const [userLang, setUserLang] = useState("en");
  const [allergenPreset, setAllergenPreset] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Read user settings + favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("transtaste_user_settings");
      if (raw) {
        const settings = JSON.parse(raw);
        if (settings.output_language) setUserLang(settings.output_language);
        if (settings.allergen_preset) setAllergenPreset(settings.allergen_preset);
      }
    } catch {
      // ignore
    }
    setFavorites(loadFavorites());
  }, []);

  const toggleFavorite = (key: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveFavorites(next);
      return next;
    });
  };

  // Expand no_ingredient template with user's allergen presets
  const filteredPhrases = useMemo(() => {
    const base = selectedCategory === "favorites"
      ? PHRASES.filter((p) => favorites.has(p.key))
      : PHRASES.filter((p) => p.category === selectedCategory);
    const expanded: Phrase[] = [];
    for (const phrase of base) {
      if (phrase.key === "no_ingredient" && allergenPreset.length > 0) {
        for (const allergen of allergenPreset) {
          const names = ALLERGEN_INGREDIENT_NAMES[allergen];
          if (!names) continue;
          const fill = (tmpl: string, lang: string) =>
            tmpl.replace(/___/g, names[lang] || names.en || allergen);
          expanded.push({
            ...phrase,
            key: `no_ingredient_${allergen}`,
            ko: fill(phrase.ko, "ko"),
            translations: Object.fromEntries(
              Object.entries(phrase.translations).map(([lang, t]) => [
                lang,
                { text: fill(t.text, lang), pronunciation: fill(t.pronunciation, lang) },
              ])
            ),
          });
        }
        // Also keep original template at the end
        expanded.push(phrase);
      } else {
        expanded.push(phrase);
      }
    }
    return expanded;
  }, [selectedCategory, allergenPreset, favorites]);

  return (
    <main className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <header className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-brown-dark">{t("phrases.title")}</h1>
        <p className="text-sm text-brown-medium mt-0.5">
          {t("phrases.subtitle")}
        </p>
      </header>

      {/* Language selector */}
      <div className="px-5 mb-4">
        <div className="flex gap-1.5 pb-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex-1 min-w-0 px-1 py-1.5 rounded-full text-xs font-medium transition-colors text-center ${
                selectedLanguage === lang.code
                  ? "bg-coral text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              {t(lang.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-5 mb-4">
        <HorizontalScroll>
          {favorites.size > 0 && (
            <button
              onClick={() => setSelectedCategory("favorites")}
              className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "favorites"
                  ? "bg-brown-dark text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              <span>⭐</span>
              <span>{t("phrases.favorites")}</span>
            </button>
          )}
          {PHRASE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-brown-dark text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{t(cat.labelKey)}</span>
            </button>
          ))}
        </HorizontalScroll>
      </div>

      {/* Phrase cards */}
      <div className="px-5 space-y-3">
        {filteredPhrases.map((phrase) => (
          <PhraseCard
            key={phrase.key}
            phrase={phrase}
            targetLang={selectedLanguage}
            userLang={userLang}
            isFavorite={favorites.has(phrase.key)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </main>
  );
}
