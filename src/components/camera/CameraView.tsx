"use client";

import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";

interface CameraViewProps {
  onCapture: (blob?: Blob | null) => void;
  onGallery: () => void;
}

export default function CameraView({ onCapture, onGallery }: CameraViewProps) {
  const { videoRef, isReady, error, start, capture, toggleFlash, isFlashOn } =
    useCamera();

  useEffect(() => {
    start();
  }, [start]);

  const handleCapture = () => {
    const blob = capture();
    if (blob) {
      onCapture(blob);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
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
            Place the menu within the frame
          </span>
        </div>

        {/* Error state — friendly UI */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 to-brown-dark/95">
            <div className="text-center px-8 max-w-[300px]">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Camera not available
              </h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                No worries! You can pick a menu photo from your gallery instead.
              </p>
              <button
                onClick={onGallery}
                className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral-dark transition-colors mb-3"
              >
                Choose from Gallery
              </button>
              <button
                onClick={start}
                className="text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
              >
                Try camera again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-black px-6 py-6 pb-10 flex items-center justify-between">
        {/* Gallery */}
        <button
          onClick={onGallery}
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
          disabled={!isReady}
          className="w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center disabled:opacity-40"
        >
          <div className="w-[58px] h-[58px] rounded-full bg-white" />
        </button>

        {/* Flash toggle */}
        <button
          onClick={toggleFlash}
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
