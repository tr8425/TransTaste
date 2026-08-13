"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreditBadge from "@/components/common/CreditBadge";
import RecentHistory from "@/components/common/RecentHistory";
import { useCredits } from "@/hooks/useCredits";
import { useTranslation } from "@/lib/i18n";
import type { RecentScan } from "@/lib/types";
import { trackProductEvent } from "@/lib/product-events";

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

interface InputModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function InputModal({ title, onClose, children }: InputModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-t-3xl bg-cream px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 shadow-2xl animate-slide-up max-h-[90dvh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-brown-dark">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-brown-medium transition-colors hover:bg-cream-dark hover:text-brown-dark"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const SAMPLE_MENU = [
  "唐揚げ 780円",
  "海老フライ 980円",
  "麻婆豆腐 850円",
  "揚げ出し豆腐 580円",
].join("\n");

export default function HomePage() {
  const { t } = useTranslation();
  const credits = useCredits();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOtherInputs, setShowOtherInputs] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

  useEffect(() => {
    trackProductEvent("home_view");
    const params = new URLSearchParams(window.location.search);
    if (params.get("input") === "text") {
      setShowOtherInputs(true);
      setShowTextModal(true);
      window.history.replaceState({}, "", "/");
    }
    try {
      const raw = localStorage.getItem("transtaste_scan_history");
      if (raw) setRecentScans(JSON.parse(raw));
    } catch {
      // Ignore malformed legacy history.
    }
  }, []);

  const startTextAnalysis = (input: string) => {
    trackProductEvent("scan_cta_click", { method: input === SAMPLE_MENU ? "sample" : "text" });
    sessionStorage.setItem("scanText", input);
    sessionStorage.setItem("scanInputType", "text");
    router.push("/scan-setup");
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    trackProductEvent("scan_cta_click", { method: "gallery" });
    const base64 = await blobToBase64(file);
    sessionStorage.setItem("scanImage", base64);
    sessionStorage.setItem("scanInputType", "image");
    router.push("/scan-setup");
  };

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!isValidHttpUrl(trimmed)) return;
    trackProductEvent("scan_cta_click", { method: "url" });
    sessionStorage.setItem("scanImage", trimmed);
    sessionStorage.setItem("scanInputType", "url");
    setShowUrlModal(false);
    setUrlInput("");
    router.push("/scan-setup");
  };

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    setShowTextModal(false);
    setTextInput("");
    startTextAnalysis(trimmed);
  };

  return (
    <main className="mengto-home min-h-screen bg-cream pb-28">
      <nav className="flex items-center justify-between border-b border-brown-dark/15 px-5 pb-4 pt-8">
        <p className="mengto-display text-lg tracking-[-0.05em] text-brown-dark" aria-label="TransTaste">
          Trans<span className="text-coral">/Taste</span>
        </p>
        <CreditBadge credits={credits.remaining} hasPass={credits.hasPass} />
      </nav>

      <section className="mengto-hero px-5 pb-10 pt-7">
        <div className="mengto-enter mengto-kicker mb-5 inline-flex items-center gap-2 border border-brown-dark bg-cream px-3 py-2 text-[10px] font-extrabold text-brown-dark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 3 4.5 6v5.5c0 4.6 3.1 7.5 7.5 9.5 4.4-2 7.5-4.9 7.5-9.5V6L12 3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          {t("home.positioningBadge")}
        </div>

        <h1 className="mengto-enter mengto-display relative z-10 max-w-[380px] text-[42px] leading-[.96] tracking-[-0.055em] text-brown-dark">
          {t("home.heroTitle")}
        </h1>
        <p className="mengto-enter relative z-10 mt-5 max-w-[330px] text-[14px] font-medium leading-6 text-brown-medium">
          {t("home.heroDesc")}
        </p>

        <div className="relative z-10 mt-7 space-y-3">
          <Link
            href="/camera"
            className="flex min-h-16 w-full items-center justify-between gap-2 bg-coral px-5 text-sm font-extrabold uppercase tracking-[.08em] text-brown-dark shadow-[6px_6px_0_#171712] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#171712] active:translate-y-1 active:shadow-none"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20 19H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            {t("home.primaryCta")}
          </Link>
          <button
            type="button"
            onClick={() => startTextAnalysis(SAMPLE_MENU)}
            className="flex min-h-12 w-full items-center justify-center gap-2 border border-brown-dark/30 bg-cream px-5 text-xs font-bold uppercase tracking-[.08em] text-brown-dark transition hover:bg-brown-dark hover:text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
            {t("home.sampleCta")}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowOtherInputs((visible) => !visible)}
          className="mx-auto mt-3 flex min-h-11 items-center gap-1.5 px-3 text-xs font-medium text-brown-medium transition hover:text-coral"
          aria-expanded={showOtherInputs}
          aria-controls="other-input-methods"
        >
          {t("home.otherInputs")}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${showOtherInputs ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showOtherInputs ? (
          <div id="other-input-methods" className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="min-h-12 rounded-xl bg-cream-dark text-xs font-semibold text-brown-medium transition hover:text-coral">
              {t("home.gallery")}
            </button>
            <button type="button" onClick={() => setShowUrlModal(true)} className="min-h-12 rounded-xl bg-cream-dark text-xs font-semibold text-brown-medium transition hover:text-coral">
              {t("home.url")}
            </button>
            <button type="button" onClick={() => setShowTextModal(true)} className="min-h-12 rounded-xl bg-cream-dark text-xs font-semibold text-brown-medium transition hover:text-coral">
              {t("home.text")}
            </button>
          </div>
        ) : null}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </section>

      <section className="px-5 pb-8" aria-labelledby="proof-heading">
        <div className="mengto-proof overflow-hidden border border-brown-dark bg-cream">
          <div className="border-b border-brown-light/10 px-4 py-3">
            <p className="mengto-kicker text-[10px] font-extrabold text-coral">{t("home.proofEyebrow")}</p>
            <h2 id="proof-heading" className="mengto-display mt-2 text-xl leading-tight text-brown-dark">{t("home.proofTitle")}</h2>
          </div>

          <div className="grid grid-cols-[0.82fr_1.18fr]">
            <div className="border-r border-brown-light/10 bg-[#F3E8D7] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-brown-medium">{t("home.originalMenu")}</p>
              <div className="-rotate-1 rounded-lg bg-[#FFFDF8] p-3 text-brown-dark shadow-sm">
                <p className="border-b border-dashed border-brown-light/30 pb-2 text-sm font-bold">おすすめ</p>
                <div className="space-y-2.5 pt-3 text-[11px]">
                  <p className="flex justify-between"><span>唐揚げ</span><span>¥780</span></p>
                  <p className="flex justify-between"><span>海老フライ</span><span>¥980</span></p>
                  <p className="flex justify-between"><span>揚げ出し豆腐</span><span>¥580</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3">
              {[
                { icon: "!", tone: "bg-danger/10 text-danger", title: t("home.demoAvoid"), detail: t("home.demoAvoidDetail") },
                { icon: "?", tone: "bg-amber-brand/10 text-amber-brand", title: t("home.demoCheck"), detail: t("home.demoCheckDetail") },
                { icon: "i", tone: "bg-success/10 text-success", title: t("home.demoClear"), detail: t("home.demoClearDetail") },
              ].map((item) => (
                <div key={item.title} className="flex gap-2.5 rounded-xl border border-brown-light/10 bg-cream p-2.5">
                  <span className={`grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-bold ${item.tone}`}>{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-brown-dark">{item.title}</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-brown-medium">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-7">
        <div className="border-l-4 border-coral bg-brown-dark p-5 text-cream">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/10 text-sm font-bold" aria-hidden>文</span>
            <div>
              <h2 className="text-sm font-semibold">{t("home.showServerTitle")}</h2>
              <p className="mt-1 text-xs leading-5 text-cream/70">{t("home.showServerDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {recentScans.length > 0 ? (
        <section className="px-5 pb-6">
          <RecentHistory items={recentScans} />
        </section>
      ) : null}

      <section className="px-5 pb-7">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            [t("home.trustLanguagesValue"), t("home.trustLanguages")],
            [t("home.trustAllergensValue"), t("home.trustAllergens")],
            [t("home.trustNoSignupValue"), t("home.trustNoSignup")],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-cream-dark px-2 py-3">
              <p className="text-base font-bold text-brown-dark">{value}</p>
              <p className="mt-0.5 text-[10px] leading-4 text-brown-medium">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] leading-4 text-brown-medium/70">{t("home.safetyNote")}</p>
      </section>

      <section className="px-5">
        <Link href="/travel" className="flex min-h-14 items-center justify-between rounded-2xl bg-cream-dark px-4 transition hover:bg-brown-light/10">
          <div>
            <p className="text-sm font-semibold text-brown-dark">{t("home.travelTools")}</p>
            <p className="text-xs text-brown-medium">{t("home.travelToolsDesc")}</p>
          </div>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brown-light" aria-hidden>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </section>

      {showUrlModal ? (
        <InputModal title={t("home.urlModalTitle")} onClose={() => { setShowUrlModal(false); setUrlInput(""); }}>
          <input
            type="url"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="https://example.com/menu.jpg"
            className="mb-2 w-full rounded-xl border border-brown-light/20 bg-cream-dark px-4 py-3 text-sm text-brown-dark outline-none transition placeholder:text-brown-medium/50 focus:border-coral"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") handleUrlSubmit();
            }}
          />
          <p className="mb-4 text-[11px] text-brown-medium/70">{t("home.urlHint")}</p>
          <button type="button" onClick={handleUrlSubmit} disabled={!isValidHttpUrl(urlInput)} className="w-full rounded-xl bg-coral py-3 font-semibold text-white transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-40">
            {t("home.fetchAndAnalyze")}
          </button>
        </InputModal>
      ) : null}

      {showTextModal ? (
        <InputModal title={t("home.textModalTitle")} onClose={() => { setShowTextModal(false); setTextInput(""); }}>
          <textarea
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            placeholder={t("home.textPlaceholder")}
            rows={5}
            className="mb-4 w-full resize-none rounded-xl border border-brown-light/20 bg-cream-dark px-4 py-3 text-sm text-brown-dark outline-none transition placeholder:text-brown-medium/50 focus:border-coral"
            autoFocus
          />
          <button type="button" onClick={handleTextSubmit} disabled={!textInput.trim()} className="w-full rounded-xl bg-coral py-3 font-semibold text-white transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-40">
            {t("home.analyzeDishes")}
          </button>
        </InputModal>
      ) : null}
    </main>
  );
}
