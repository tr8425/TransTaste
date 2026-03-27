"use client";

import { useState, useEffect } from "react";
import { PHRASE_CATEGORIES, PHRASES, type Phrase } from "@/lib/phrases-data";

const LANGUAGES = [
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "th", label: "Thai" },
  { code: "vi", label: "Vietnamese" },
  { code: "en", label: "English" },
] as const;

type CategoryId = (typeof PHRASE_CATEGORIES)[number]["id"];
type LangCode = (typeof LANGUAGES)[number]["code"];

function PhraseCard({
  phrase,
  targetLang,
  userLang,
}: {
  phrase: Phrase;
  targetLang: LangCode;
  userLang: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
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
            Server might say:
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
          onClick={() => setBookmarked(!bookmarked)}
          className="text-brown-light hover:text-coral transition-colors"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark phrase"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
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
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>("ja");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("basic");
  const [userLang, setUserLang] = useState("en");

  // Read user output language from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("transtaste_user_settings");
      if (raw) {
        const settings = JSON.parse(raw);
        if (settings.output_language) {
          setUserLang(settings.output_language);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredPhrases = PHRASES.filter(
    (p) => p.category === selectedCategory
  );

  return (
    <main className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <header className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-brown-dark">Restaurant Talk</h1>
        <p className="text-sm text-brown-medium mt-0.5">
          Show your phone to communicate
        </p>
      </header>

      {/* Language selector */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLanguage === lang.code
                  ? "bg-coral text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {PHRASE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-brown-dark text-white"
                  : "bg-cream-dark text-brown-medium hover:bg-brown-light/20"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Phrase cards */}
      <div className="px-5 space-y-3">
        {filteredPhrases.map((phrase) => (
          <PhraseCard
            key={phrase.key}
            phrase={phrase}
            targetLang={selectedLanguage}
            userLang={userLang}
          />
        ))}
      </div>
    </main>
  );
}
