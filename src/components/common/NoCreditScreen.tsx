"use client";

interface NoCreditScreenProps {
  onPurchase: () => void;
}

export default function NoCreditScreen({ onPurchase }: NoCreditScreenProps) {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-cream px-6 py-12">
      <div className="mx-auto w-full max-w-md flex flex-col items-center text-center gap-5">
        {/* Lightning bolt icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-coral/10">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-coral"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-brown-dark">
          You&apos;re out of credits
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-brown-medium leading-relaxed">
          Get a Trip Pass to keep exploring menus
        </p>

        {/* Primary button */}
        <button
          onClick={onPurchase}
          className="mt-2 w-full rounded-xl bg-coral py-3.5 text-sm font-semibold text-white shadow-sm active:bg-coral-dark transition-colors"
        >
          Get Trip Pass &mdash; $2.99
        </button>

        {/* Secondary link */}
        <button
          onClick={onPurchase}
          className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-2"
        >
          Buy 50 Credits &mdash; $1.99
        </button>

        {/* Fine print */}
        <p className="text-xs text-brown-light mt-1">
          7-day pass &middot; One-time payment
        </p>
      </div>
    </div>
  );
}
