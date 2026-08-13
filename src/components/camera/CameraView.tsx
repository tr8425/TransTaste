"use client";

import { useEffect, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useTranslation } from "@/lib/i18n";

interface CameraViewProps {
  onCapture: (blob?: Blob | null) => void | Promise<void>;
  onGallery: () => void;
  onBack?: () => void;
  onQrDetected?: (url: string) => void;
}

export default function CameraView({ onCapture, onGallery, onBack, onQrDetected }: CameraViewProps) {
  const { t } = useTranslation();
  const { videoRef, isReady, error, start, capture, toggleFlash, isFlashOn, qrData, clearQr } =
    useCamera();
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    start();
  }, [start]);

  // Handle QR code detection
  useEffect(() => {
    if (qrData && onQrDetected) {
      try {
        new URL(qrData); // Validate it's a URL
        onQrDetected(qrData);
        clearQr();
      } catch {
        clearQr(); // Not a URL, ignore
      }
    }
  }, [qrData, onQrDetected, clearQr]);

  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    // Camera-shutter style flash + a brief disabled state so the user sees
    // immediate feedback while we compress the image and navigate.
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 220);
    try {
      const blob = await capture();
      if (blob) {
        await onCapture(blob);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#11110e]">
      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {/* Back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={t("common.back")}
            className="absolute left-4 top-12 z-10 flex h-11 w-11 items-center justify-center border border-white/40 bg-black/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Corner guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative aspect-[3/4] w-[82%] border border-white/25">
            {/* Top-left */}
            <div className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-coral" />
            {/* Top-right */}
            <div className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-coral" />
            {/* Bottom-left */}
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-4 border-l-4 border-coral" />
            {/* Bottom-right */}
            <div className="absolute bottom-0 right-0 h-10 w-10 border-b-4 border-r-4 border-coral" />
          </div>
        </div>

        {/* Guide text */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <span className="border border-white/30 bg-black/65 px-4 py-2 text-xs font-bold uppercase tracking-[.12em] text-white">
            {t("camera.placeMenu")}
          </span>
        </div>

        {/* Shutter flash overlay — fades out within ~220ms */}
        {showFlash && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-white pointer-events-none animate-camera-flash"
          />
        )}

        {/* Error state — friendly UI */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 to-brown-dark/95">
            <div className="text-center px-8 max-w-[300px]">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-white text-lg font-semibold mb-2">
                {t("camera.cameraNotAvailable")}
              </h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                {t("camera.noWorries")}
              </p>
              <button
                onClick={onGallery}
                className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors mb-3"
              >
                {t("camera.chooseFromGallery")}
              </button>
              <button
                onClick={start}
                className="text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
              >
                {t("camera.tryCameraAgain")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-white/20 bg-[#11110e] px-6 py-6 pb-10">
        {/* Gallery */}
        <button
          type="button"
          onClick={onGallery}
          aria-label={t("home.gallery")}
          className="flex h-12 w-12 items-center justify-center border border-white/30 bg-white/10"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>

        {/* Capture button */}
        <button
          onClick={handleCapture}
          disabled={!isReady || isCapturing}
          aria-label={t("camera.takePhoto")}
          className="w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95"
        >
          <div
            className={`rounded-full bg-white transition-all duration-150 ${
              isCapturing ? "w-[42px] h-[42px]" : "w-[58px] h-[58px]"
            }`}
          />
        </button>

        {/* Flash toggle */}
        <button
          type="button"
          onClick={toggleFlash}
          aria-label={t(isFlashOn ? "camera.turnFlashOff" : "camera.turnFlashOn")}
          aria-pressed={isFlashOn}
          className={`flex h-12 w-12 items-center justify-center border border-white/30 ${
            isFlashOn ? "bg-amber-brand/30" : "bg-white/10"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isFlashOn ? "#BA7517" : "white"}
            strokeWidth="1.5"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
