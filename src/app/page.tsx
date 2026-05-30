"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreditBadge from "@/components/common/CreditBadge";
import RecentHistory from "@/components/common/RecentHistory";
import { useCredits } from "@/hooks/useCredits";
import { RecentScan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function HomePage() {
  const { t } = useTranslation();
  const credits = useCredits();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

  // Auto-redirect to onboarding on first launch
  useEffect(() => {
    const hasOnboarded = localStorage.getItem("transtaste_user_settings");
    const skippedOnboarding = localStorage.getItem("transtaste_onboarding_done");
    if (!hasOnboarded && !skippedOnboarding) {
      router.push("/onboarding");
    }
    try {
      const raw = localStorage.getItem("transtaste_scan_history");
      if (raw) setRecentScans(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [router]);

  const handleGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      sessionStorage.setItem("scanImage", base64);
      sessionStorage.setItem("scanInputType", "image");
      router.push("/loading-scan");
    }
  };

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!isValidHttpUrl(trimmed)) return;
    sessionStorage.setItem("scanImage", trimmed);
    sessionStorage.setItem("scanInputType", "url");
    setShowUrlModal(false);
    setUrlInput("");
    router.push("/loading-scan");
  };

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    sessionStorage.setItem("scanText", trimmed);
    sessionStorage.setItem("scanInputType", "text");
    setShowTextModal(false);
    setTextInput("");
    router.push("/loading-scan");
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav bar */}
      <nav className="flex items-center justify-between px-5 pt-12 pb-4">
        <p className="text-xl font-bold text-brown-dark tracking-tight" aria-label="TransTaste">
          Trans<span className="text-coral">Taste</span>
        </p>
        <CreditBadge credits={credits.remaining} hasPass={credits.hasPass} />
      </nav>

      {/* Hero — compact */}
      <div className="flex flex-col items-center px-6 pt-4">
        <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-coral/10 via-cream-dark to-amber-brand/10 flex items-center justify-center mb-5">
          <span className="text-5xl">🍽️</span>
        </div>

        <h1 className="text-lg font-semibold text-brown-dark text-center mb-1">
          {t("home.heroTitle")}
        </h1>
        <p className="text-sm text-brown-medium text-center mb-6 max-w-[280px]">
          {t("home.heroDesc")}
        </p>

        {/* Camera CTA */}
        <Link
          href="/camera"
          className="w-[72px] h-[72px] rounded-full bg-coral shadow-lg shadow-coral/30 flex items-center justify-center hover:bg-coral-dark transition-colors active:scale-95 mb-4"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </Link>

        {/* Input row: Gallery | URL | Text */}
        <div className="flex gap-3 mb-6">
          {/* Gallery button */}
          <button
            onClick={handleGallery}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-cream-dark text-brown-medium text-sm font-medium hover:bg-brown-light/20 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            {t("home.gallery")}
          </button>

          {/* URL button */}
          <button
            onClick={() => setShowUrlModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-cream-dark text-brown-medium text-sm font-medium hover:bg-brown-light/20 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {t("home.url")}
          </button>

          {/* Text button */}
          <button
            onClick={() => setShowTextModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-cream-dark text-brown-medium text-sm font-medium hover:bg-brown-light/20 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {t("home.text")}
          </button>
        </div>

        {/* Hidden file input for gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Recent scans */}
      <div className="px-5 pt-2 pb-2">
        <RecentHistory items={recentScans} />
      </div>

      {/* Quick access — Travel Tools */}
      <div className="px-5 pt-4 pb-2">
        <Link
          href="/travel"
          className="flex items-center justify-between bg-cream-dark rounded-xl p-4 hover:bg-brown-light/10 transition-colors active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
              <span className="text-lg">{"\u{1F30D}"}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-brown-dark">{t("home.travelTools")}</p>
              <p className="text-xs text-brown-medium">{t("home.travelToolsDesc")}</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* Trending dishes section */}
      <div className="px-5 pt-4 pb-28">
        <h3 className="text-xs font-medium text-brown-medium mb-3 px-1 uppercase tracking-wider">
          {t("home.popularDishes")}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { emoji: "🍜", name: "Pho Bo", originKey: "vietnamese" },
            { emoji: "🍣", name: "Omakase", originKey: "japanese" },
            { emoji: "🥘", name: "Tom Yum", originKey: "thai" },
            { emoji: "🥟", name: "Xiao Long Bao", originKey: "chinese" },
          ].map((dish) => (
            <button
              key={dish.name}
              onClick={() => {
                sessionStorage.setItem("scanText", dish.name);
                sessionStorage.setItem("scanInputType", "text");
                router.push("/loading-scan");
              }}
              className="bg-cream-dark rounded-xl p-3 flex items-center gap-2.5 hover:bg-brown-light/10 transition-colors cursor-pointer text-left"
            >
              <span className="text-2xl">{dish.emoji}</span>
              <div>
                <p className="text-sm font-medium text-brown-dark leading-tight">
                  {dish.name}
                </p>
                <p className="text-[11px] text-brown-medium">{t(`home.cuisine.${dish.originKey}`)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-cream rounded-t-2xl px-5 pt-6 pb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-brown-dark flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {t("home.urlModalTitle")}
              </h3>
              <button
                onClick={() => { setShowUrlModal(false); setUrlInput(""); }}
                className="text-brown-medium hover:text-brown-dark p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/menu.jpg"
              className="w-full px-4 py-3 rounded-xl bg-cream-dark text-brown-dark text-sm placeholder:text-brown-medium/50 border border-brown-light/20 focus:outline-none focus:border-coral mb-4"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            />
            <p className="text-[11px] text-brown-medium/60 mb-3 -mt-2">
              {t("home.urlHint")}
            </p>
            <button
              onClick={handleUrlSubmit}
              disabled={!isValidHttpUrl(urlInput)}
              className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("home.fetchAndAnalyze")}
            </button>
          </div>
        </div>
      )}

      {/* Text Modal */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-cream rounded-t-2xl px-5 pt-6 pb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-brown-dark">
                {t("home.textModalTitle")}
              </h3>
              <button
                onClick={() => { setShowTextModal(false); setTextInput(""); }}
                className="text-brown-medium hover:text-brown-dark p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t("home.textPlaceholder")}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-cream-dark text-brown-dark text-sm placeholder:text-brown-medium/50 border border-brown-light/20 focus:outline-none focus:border-coral mb-4 resize-none"
              autoFocus
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("home.analyzeDishes")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
