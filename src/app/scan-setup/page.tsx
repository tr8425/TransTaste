"use client";

import { useRouter } from "next/navigation";
import QuickDietarySetup from "@/components/onboarding/QuickDietarySetup";
import { useTranslation } from "@/lib/i18n";

export default function ScanSetupPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-cream px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="mb-6 grid min-h-11 min-w-11 place-items-center rounded-full text-brown-medium transition hover:bg-cream-dark hover:text-brown-dark"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <QuickDietarySetup />
      </div>
    </main>
  );
}
