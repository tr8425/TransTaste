"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditState } from "@/lib/types";

const STORAGE_KEY = "transtaste_credits";
const DEFAULT_STATE: CreditState = {
  remaining: 10,
  hasPass: false,
};

/** Demote an expired pass. Returns the cleaned state and whether anything changed. */
function reconcileExpiry(s: CreditState): { state: CreditState; changed: boolean } {
  if (!s.hasPass || !s.passExpiresAt) return { state: s, changed: false };
  if (new Date(s.passExpiresAt).getTime() > Date.now()) return { state: s, changed: false };
  // Pass expired — clear pass fields, keep remaining credits intact
  const cleaned: CreditState = { ...s, hasPass: false };
  delete cleaned.passType;
  delete cleaned.passExpiresAt;
  return { state: cleaned, changed: true };
}

export function useCredits() {
  const [state, setState] = useState<CreditState>(DEFAULT_STATE);
  const [freeEvent, setFreeEvent] = useState(false);

  const loadAndReconcile = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<CreditState>;
      // JSON.stringify(Infinity) → null and partial writes can leave remaining
      // missing/non-finite. Coerce to a safe integer before reconciling.
      const sanitized: CreditState = {
        remaining: Number.isFinite(parsed.remaining)
          ? Math.max(0, Math.floor(parsed.remaining as number))
          : DEFAULT_STATE.remaining,
        hasPass: !!parsed.hasPass,
        ...(parsed.passType ? { passType: parsed.passType } : {}),
        ...(parsed.passExpiresAt ? { passExpiresAt: parsed.passExpiresAt } : {}),
      };
      const { state: next, changed } = reconcileExpiry(sanitized);
      setState(next);
      const drifted = changed || JSON.stringify(parsed) !== JSON.stringify(next);
      if (drifted) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    loadAndReconcile();
    fetch("/api/event-status")
      .then((r) => r.json())
      .then((d) => { if (d.active) setFreeEvent(true); })
      .catch(() => {});

    // Re-check on every signal that the tab might be returning to active use
    // or that another tab/page mutated localStorage.
    const onVisibility = () => { if (!document.hidden) loadAndReconcile(); };
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) loadAndReconcile(); };
    const onPageShow = () => loadAndReconcile();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", loadAndReconcile);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("storage", onStorage);
    const interval = setInterval(loadAndReconcile, 60 * 1000);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", loadAndReconcile);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [loadAndReconcile]);

  const save = (next: CreditState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const useCredit = (): boolean => {
    if (state.hasPass) return true;
    if (state.remaining <= 0) return false;
    save({ ...state, remaining: state.remaining - 1 });
    return true;
  };

  const canScan = (): boolean => {
    return state.hasPass || state.remaining > 0;
  };

  const purchasePass = (type: "7d" | "30d") => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (type === "7d" ? 7 : 30));
    save({
      ...state,
      hasPass: true,
      passType: type,
      passExpiresAt: expiresAt.toISOString(),
    });
  };

  const purchaseCredits = (amount: number) => {
    save({ ...state, remaining: state.remaining + amount });
  };

  const isPhase2Free = state.hasPass || freeEvent;

  return { ...state, useCredit, canScan, purchasePass, purchaseCredits, freeEvent, isPhase2Free };
}
