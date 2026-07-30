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
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {/* Back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={t("common.back")}
            className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
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
          <div className="relative w-[80%] aspect-[3/4]">
            {/* Top-left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
            {/* Top-right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
            {/* Bottom-left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
            {/* Bottom-right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
          </div>
        </div>

        {/* Guide text */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <span className="text-white/70 text-sm bg-black/30 px-4 py-1.5 rounded-full">
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
      <div className="bg-black px-6 py-6 pb-10 flex items-center justify-between">
        {/* Gallery */}
        <button
          type="button"
          onClick={onGallery}
          aria-label={t("home.gallery")}
          className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"
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
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
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
