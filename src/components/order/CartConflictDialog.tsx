"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n";

interface CartConflictDialogProps {
  isOpen: boolean;
  /** Clear the current order and start a new one with the pending item. */
  onStartNew: () => void;
  onCancel: () => void;
}

/**
 * In-app confirm shown when an item from a different menu or currency would be
 * added to the current order. Replaces window.confirm so it matches the UI.
 */
export default function CartConflictDialog({ isOpen, onStartNew, onCancel }: CartConflictDialogProps) {
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-6 sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cart-conflict-title"
        aria-describedby="cart-conflict-desc"
        className="relative w-full max-w-[400px] border border-brown-dark bg-cream p-5 shadow-[5px_5px_0_rgba(23,23,18,.2)]"
      >
        <h2 id="cart-conflict-title" className="text-base font-bold text-brown-dark">
          {t("order.conflictTitle")}
        </h2>
        <p id="cart-conflict-desc" className="mt-2 text-sm leading-6 text-brown-medium">
          {t("order.conflictDesc")}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onStartNew}
            className="min-h-12 w-full rounded-xl bg-coral px-4 text-sm font-semibold text-white transition-colors hover:bg-coral-dark active:scale-[0.98]"
          >
            {t("order.conflictStartNew")}
          </button>
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-11 w-full rounded-xl px-4 text-sm font-medium text-brown-medium transition-colors hover:text-brown-dark"
          >
            {t("order.conflictKeep")}
          </button>
        </div>
      </div>
    </div>
  );
}
