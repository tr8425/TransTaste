"use client";

import { useState, useEffect } from "react";
import { CreditState } from "@/lib/types";

const STORAGE_KEY = "transtaste_credits";
const DEFAULT_STATE: CreditState = {
  remaining: 10,
  hasPass: false,
};

export function useCredits() {
  const [state, setState] = useState<CreditState>(DEFAULT_STATE);
  const [freeEvent, setFreeEvent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    fetch("/api/event-status")
      .then((r) => r.json())
      .then((d) => { if (d.active) setFreeEvent(true); })
      .catch(() => {});
  }, []);

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
