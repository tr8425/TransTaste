"use client";

import { useTranslation } from "@/lib/i18n";

interface ErrorScreenProps {
  type:
    | "not_menu"
    | "ocr_failed"
    | "low_confidence"
    | "no_text"
    | "camera_unavailable"
    | "network_error";
  onRetry?: () => void;
  onGallery?: () => void;
  onTextInput?: () => void;
  onBack?: () => void;
}

/* ── icon helpers (48 × 48 inline SVGs) ────────────────────────── */

function CameraXIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-coral"
    >
      <path d="M6 12h4l3-4h22l3 4h4a2 2 0 012 2v22a2 2 0 01-2 2H6a2 2 0 01-2-2V14a2 2 0 012-2z" />
      <circle cx="24" cy="24" r="7" />
      <line x1="20" y1="20" x2="28" y2="28" />
      <line x1="28" y1="20" x2="20" y2="28" />
    </svg>
  );
}

function CameraQuestionIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-coral"
    >
      <path d="M6 12h4l3-4h22l3 4h4a2 2 0 012 2v22a2 2 0 01-2 2H6a2 2 0 01-2-2V14a2 2 0 012-2z" />
      <path d="M21 21a3 3 0 115.2 2.1c-.8.6-2.2 1.2-2.2 2.9" />
      <circle cx="24" cy="30" r="0.5" fill="currentColor" />
    </svg>
  );
}

function DocumentXIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-coral"
    >
      <path d="M12 6h16l10 10v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <polyline points="28 6 28 16 38 16" />
      <line x1="20" y1="26" x2="28" y2="34" />
      <line x1="28" y1="26" x2="20" y2="34" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-coral"
    >
      <path d="M6 12h4l3-4h22l3 4h4a2 2 0 012 2v22a2 2 0 01-2 2H6a2 2 0 01-2-2V14a2 2 0 012-2z" />
      <circle cx="24" cy="24" r="7" />
      <line x1="4" y1="4" x2="44" y2="44" />
    </svg>
  );
}

function WifiXIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-coral"
    >
      <path d="M8 16a24.8 24.8 0 0132 0" />
      <path d="M14 22a16.5 16.5 0 0120 0" />
      <path d="M19 28a8.3 8.3 0 0110 0" />
      <circle cx="24" cy="34" r="1.5" fill="currentColor" />
      <line x1="34" y1="10" x2="42" y2="18" />
      <line x1="42" y1="10" x2="34" y2="18" />
    </svg>
  );
}

function WarningTriangleIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-brand"
    >
      <path d="M24 6L4 42h40L24 6z" />
      <line x1="24" y1="20" x2="24" y2="30" />
      <circle cx="24" cy="35" r="1" fill="currentColor" />
    </svg>
  );
}

/* ── error configurations ──────────────────────────────────────── */

interface ErrorConfig {
  icon: React.ReactNode;
  titleKey: string;
  subtitleKey: string;
  primaryLabelKey: string | null;
  primaryAction: "retry" | "gallery";
  showCreditsNote: boolean;
}

const ERROR_CONFIG: Record<ErrorScreenProps["type"], ErrorConfig> = {
  not_menu: {
    icon: <CameraXIcon />,
    titleKey: "errorScreen.notMenuTitle",
    subtitleKey: "errorScreen.notMenuSubtitle",
    primaryLabelKey: "errorScreen.scanAgain",
    primaryAction: "retry",
    showCreditsNote: true,
  },
  ocr_failed: {
    icon: <CameraQuestionIcon />,
    titleKey: "errorScreen.ocrTitle",
    subtitleKey: "errorScreen.ocrSubtitle",
    primaryLabelKey: "common.tryAgain",
    primaryAction: "retry",
    showCreditsNote: true,
  },
  no_text: {
    icon: <DocumentXIcon />,
    titleKey: "errorScreen.noTextTitle",
    subtitleKey: "errorScreen.noTextSubtitle",
    primaryLabelKey: "errorScreen.scanAgain",
    primaryAction: "retry",
    showCreditsNote: true,
  },
  camera_unavailable: {
    icon: <CameraOffIcon />,
    titleKey: "errorScreen.cameraTitle",
    subtitleKey: "errorScreen.cameraSubtitle",
    primaryLabelKey: "camera.chooseFromGallery",
    primaryAction: "gallery",
    showCreditsNote: false,
  },
  network_error: {
    icon: <WifiXIcon />,
    titleKey: "errorScreen.networkTitle",
    subtitleKey: "errorScreen.networkSubtitle",
    primaryLabelKey: "common.tryAgain",
    primaryAction: "retry",
    showCreditsNote: false,
  },
  low_confidence: {
    icon: <WarningTriangleIcon />,
    titleKey: "errorScreen.lowConfTitle",
    subtitleKey: "errorScreen.lowConfSubtitle",
    primaryLabelKey: null,
    primaryAction: "retry",
    showCreditsNote: false,
  },
};

/* ── component ─────────────────────────────────────────────────── */

export default function ErrorScreen({
  type,
  onRetry,
  onGallery,
  onTextInput,
  onBack,
}: ErrorScreenProps) {
  const { t } = useTranslation();
  const config = ERROR_CONFIG[type];

  /* low_confidence renders as a banner, not full-screen */
  if (type === "low_confidence") {
    return (
      <div className="w-full rounded-xl bg-[#FEF3C7] px-4 py-3 flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-brand"
          >
            <path d="M24 6L4 42h40L24 6z" />
            <line x1="24" y1="20" x2="24" y2="30" />
            <circle cx="24" cy="35" r="1" fill="currentColor" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brown-dark">
            {t(config.titleKey)}
          </p>
          <p className="text-xs text-brown-medium mt-0.5">{t(config.subtitleKey)}</p>
        </div>
      </div>
    );
  }

  /* Resolve which handler to use for the primary button */
  const primaryHandler =
    config.primaryAction === "gallery" ? onGallery : onRetry;

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-cream px-6 py-12">
      <div className="mx-auto w-full max-w-md flex flex-col items-center text-center gap-5">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="self-start -mt-4 mb-2 flex items-center gap-1 text-sm text-brown-medium hover:text-brown-dark transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t("common.back")}
          </button>
        )}

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-coral/10">
          {config.icon}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-brown-dark">
          {t(config.titleKey)}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-brown-medium leading-relaxed">
          {t(config.subtitleKey)}
        </p>

        {/* No credits used note */}
        {config.showCreditsNote && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {t("errorScreen.noCreditsUsed")}
          </span>
        )}

        {/* Primary button */}
        {config.primaryLabelKey && primaryHandler && (
          <button
            onClick={primaryHandler}
            className="mt-2 w-full rounded-xl bg-coral py-3.5 text-sm font-semibold text-white shadow-sm active:bg-coral-dark transition-colors"
          >
            {t(config.primaryLabelKey)}
          </button>
        )}

        {/* Secondary actions */}
        <div className="flex flex-col items-center gap-3 mt-1">
          {/* camera_unavailable: "Try camera again" */}
          {type === "camera_unavailable" && onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-2"
            >
              {t("camera.tryCameraAgain")}
            </button>
          )}

          {/* not_menu / ocr_failed / no_text: gallery + text input */}
          {(type === "not_menu" ||
            type === "ocr_failed" ||
            type === "no_text") && (
            <>
              {onGallery && (
                <button
                  onClick={onGallery}
                  className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-2"
                >
                  {t("camera.chooseFromGallery")}
                </button>
              )}
              {onTextInput && (
                <button
                  onClick={onTextInput}
                  className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-2"
                >
                  {t("errorScreen.typeDishNames")}
                </button>
              )}
            </>
          )}

          {/* network_error: view recent scans */}
          {type === "network_error" && (
            <a
              href="/results"
              className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-2"
            >
              {t("errorScreen.viewRecentScans")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
