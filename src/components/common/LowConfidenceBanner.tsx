"use client";

import { useState } from "react";

interface LowConfidenceBannerProps {
  onDismiss?: () => void;
}

export default function LowConfidenceBanner({
  onDismiss,
}: LowConfidenceBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className="sticky top-0 z-10 w-full bg-[#FEF3C7] px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-md items-start gap-3">
        {/* Warning triangle icon */}
        <span className="mt-0.5 shrink-0">
          <svg
            width="18"
            height="18"
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

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brown-dark">
            Some items might be inaccurate
          </p>
          <p className="text-xs text-brown-medium mt-0.5">
            Use as reference only
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="shrink-0 mt-0.5 rounded p-0.5 text-brown-medium hover:text-brown-dark transition-colors"
          aria-label="Dismiss"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
