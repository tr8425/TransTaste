"use client";

interface CreditBadgeProps {
  credits: number;
  hasPass?: boolean;
}

export default function CreditBadge({ credits, hasPass }: CreditBadgeProps) {
  if (hasPass) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Trip Pass
      </span>
    );
  }

  const isWarning = credits <= 3;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isWarning ? "bg-coral/10 text-coral" : "bg-cream-dark text-brown-medium"
      }`}
    >
      {/* Bolt / scan icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <span>{credits} left</span>
    </span>
  );
}
