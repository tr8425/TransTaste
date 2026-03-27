"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── Data ──────────────────────────────────────────────── */

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
] as const;

const ALLERGENS = [
  { id: "shellfish", label: "Shellfish" },
  { id: "peanuts", label: "Peanuts" },
  { id: "tree_nuts", label: "Tree Nuts" },
  { id: "milk", label: "Milk" },
  { id: "eggs", label: "Eggs" },
  { id: "fish", label: "Fish" },
  { id: "soy", label: "Soy" },
  { id: "wheat_gluten", label: "Wheat/Gluten" },
  { id: "sesame", label: "Sesame" },
  { id: "celery", label: "Celery" },
  { id: "mustard", label: "Mustard" },
  { id: "lupin", label: "Lupin" },
  { id: "molluscs", label: "Molluscs" },
  { id: "sulphites", label: "Sulphites" },
] as const;

const DIETARY = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
  { id: "no_beef", label: "No Beef (Hindu)" },
  { id: "no_alcohol", label: "No Alcohol" },
] as const;

/* ── Icons ─────────────────────────────────────────────── */

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-coral">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-coral">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-coral">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── Page ──────────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 2 state
  const [language, setLanguage] = useState("en");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);

  const toggleAllergen = (id: string) =>
    setAllergens((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const toggleDietary = (id: string) =>
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );

  const handleSave = () => {
    const settings = {
      output_language: language,
      allergen_preset: allergens,
      dietary_beliefs: dietary,
    };
    localStorage.setItem("transtaste_user_settings", JSON.stringify(settings));
    router.push("/");
  };

  const handleSkip = () => {
    localStorage.setItem("transtaste_onboarding_done", "true");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center">
      {/* Step indicator dots */}
      <div className="flex gap-2 pt-12 pb-6">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i === step ? "bg-coral" : "bg-brown-medium/30"
            }`}
          />
        ))}
      </div>

      {/* Steps container */}
      <div className="w-full max-w-md px-6 flex-1 relative overflow-hidden">
        {/* Step 1: Introduction */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            step === 0
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full absolute inset-0 px-6 pointer-events-none"
          }`}
        >
          {/* Logo */}
          <h1 className="text-3xl font-bold text-center mb-10">
            <span className="text-brown-dark">Trans</span>
            <span className="text-coral">Taste</span>
          </h1>

          {/* Feature highlights */}
          <div className="space-y-6 mb-10">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center shrink-0">
                <CameraIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-brown-dark">Scan any menu</p>
                <p className="text-sm text-brown-medium mt-0.5">
                  Get instant translations and dish info
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center shrink-0">
                <ShieldIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-brown-dark">Know your allergens</p>
                <p className="text-sm text-brown-medium mt-0.5">
                  Set your dietary preferences once, stay safe everywhere
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center shrink-0">
                <ChatIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-brown-dark">Talk to servers</p>
                <p className="text-sm text-brown-medium mt-0.5">
                  Ready-made phrases in the local language
                </p>
              </div>
            </div>
          </div>

          {/* Free scans badge */}
          <div className="flex justify-center mb-8">
            <span className="bg-coral text-white text-xs font-semibold px-4 py-1.5 rounded-full">
              10 free scans included
            </span>
          </div>

          {/* Get Started button */}
          <button
            onClick={() => setStep(1)}
            className="w-full py-3.5 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>

        {/* Step 2: Language + Allergy Setup */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            step === 1
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full absolute inset-0 px-6 pointer-events-none"
          }`}
        >
          {/* Output Language */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-brown-dark mb-3">I speak...</h2>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => {
                const selected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`relative flex items-center justify-center py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                      selected
                        ? "border-2 border-coral bg-coral/10 text-brown-dark"
                        : "border-2 border-transparent bg-cream-dark text-brown-medium hover:bg-brown-light/15"
                    }`}
                  >
                    {lang.label}
                    {selected && (
                      <CheckIcon className="absolute right-2.5 text-coral" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Allergy Preset */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-brown-dark mb-1">Any allergies?</h2>
            <p className="text-sm text-brown-medium mb-3">
              We&apos;ll flag these in every scan
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ALLERGENS.map((item) => {
                const selected = allergens.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleAllergen(item.id)}
                    className={`py-2 px-2 rounded-full text-xs font-medium transition-all ${
                      selected
                        ? "bg-danger text-white"
                        : "bg-cream-dark text-brown-medium hover:bg-brown-light/15"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Dietary Beliefs */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-brown-dark mb-3">Dietary preferences</h2>
            <div className="flex flex-wrap gap-2">
              {DIETARY.map((item) => {
                const selected = dietary.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleDietary(item.id)}
                    className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      selected
                        ? "bg-success text-white"
                        : "bg-cream-dark text-brown-medium hover:bg-brown-light/15"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Bottom buttons */}
          <div className="pb-10">
            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors active:scale-[0.98] mb-3"
            >
              Save &amp; Start Scanning
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-2 text-sm text-brown-medium font-medium hover:text-brown-dark transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
