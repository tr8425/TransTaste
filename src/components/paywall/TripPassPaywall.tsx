"use client";

import { PASS_OPTIONS } from "@/lib/constants";

interface TripPassPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (planId: string) => void;
}

export default function TripPassPaywall({
  isOpen,
  onClose,
  onPurchase,
}: TripPassPaywallProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-mobile bg-cream rounded-t-2xl sm:rounded-2xl p-6 pb-10 sm:m-4 animate-slide-up">
        {/* Close / Skip */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brown-medium/60 text-sm"
        >
          Skip
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <span className="text-3xl mb-2 block">🌏</span>
          <h2 className="text-xl font-bold text-brown-dark">
            Want to explore deeper?
          </h2>
          <p className="text-sm text-brown-medium mt-1">
            Unlock flavor profiles, fun facts & eating guides
          </p>
        </div>

        {/* Plan cards */}
        <div className="space-y-3 mb-6">
          {PASS_OPTIONS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onPurchase(plan.id)}
              className={`w-full text-left rounded-xl p-4 transition-all ${
                plan.featured
                  ? "bg-coral/5 border-2 border-coral shadow-sm"
                  : "bg-cream-dark border border-brown-light/20 hover:border-coral/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  {plan.badge && (
                    <span className="inline-block text-[10px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                      {plan.badge}
                    </span>
                  )}
                  <h3
                    className={`font-semibold ${
                      plan.featured ? "text-brown-dark text-base" : "text-brown-dark text-sm"
                    }`}
                  >
                    {plan.label}
                  </h3>
                  <p className="text-xs text-brown-medium mt-0.5">
                    {plan.description}
                  </p>
                </div>
                <span
                  className={`font-bold whitespace-nowrap ${
                    plan.featured ? "text-coral text-lg" : "text-brown-dark text-base"
                  }`}
                >
                  {plan.price}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Reassurance */}
        <p className="text-center text-xs text-brown-medium/70">
          One-time payment &middot; No subscription &middot; Instant access
        </p>

        <style jsx>{`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
