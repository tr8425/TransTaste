"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditState } from "@/lib/types";

const STORAGE_KEY = "transtaste_credits";
const configuredFreeScanLimit = Number.parseInt(
  process.env.NEXT_PUBLIC_FREE_SCAN_LIMIT || "",
  10,
);
export const DEFAULT_FREE_SCAN_LIMIT =
  Number.isFinite(configuredFreeScanLimit) && configuredFreeScanLimit > 0
    ? configuredFreeScanLimit
    : 3;

/**
 * Stored shape of `transtaste_credits`.
 * - `passType` / `passExpiresAt` describe a real (purchased) 7d/30d pass only.
 * - `admin_expires_at` mirrors a server-verified owner session, kept separate
 *   so activating/deactivating admin never touches a real pass.
 * - `hasPass` is a derived mirror (admin active OR valid real pass). It is still
 *   written to storage because some readers (loading-scan) check it directly.
 */
interface StoredCredits {
  remaining: number;
  hasPass: boolean;
  passType?: "7d" | "30d";
  passExpiresAt?: string;
  admin_expires_at?: string;
}

const DEFAULT_STATE: StoredCredits = {
  remaining: DEFAULT_FREE_SCAN_LIMIT,
  hasPass: false,
};

function isFuture(iso?: string): boolean {
  if (!iso) return false;
  const time = new Date(iso).getTime();
  return Number.isFinite(time) && time > Date.now();
}

/** Recompute derived fields and drop expired pass/admin entries. */
function normalize(s: StoredCredits): StoredCredits {
  const next: StoredCredits = { remaining: s.remaining, hasPass: false };
  if ((s.passType === "7d" || s.passType === "30d") && isFuture(s.passExpiresAt)) {
    next.passType = s.passType;
    next.passExpiresAt = s.passExpiresAt;
  }
  if (isFuture(s.admin_expires_at)) {
    next.admin_expires_at = s.admin_expires_at;
  }
  next.hasPass = Boolean(next.passType || next.admin_expires_at);
  return next;
}

/** Parse raw storage (including the legacy shape where admin overwrote passType). */
function parseStored(raw: string | null): StoredCredits | null {
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Partial<CreditState> & { admin_expires_at?: string };
  // JSON.stringify(Infinity) -> null and partial writes can leave remaining
  // missing/non-finite. Coerce to a safe integer before reconciling.
  const remaining = Number.isFinite(parsed.remaining)
    ? Math.max(0, Math.floor(parsed.remaining as number))
    : DEFAULT_STATE.remaining;
  const base: StoredCredits = { remaining, hasPass: !!parsed.hasPass };
  if (parsed.passType === "admin") {
    // Legacy: admin used to be stored in the pass fields.
    base.admin_expires_at = parsed.passExpiresAt;
  } else if (parsed.passType) {
    base.passType = parsed.passType;
    base.passExpiresAt = parsed.passExpiresAt;
  }
  if (parsed.admin_expires_at) base.admin_expires_at = parsed.admin_expires_at;
  return base;
}

function writeStored(next: StoredCredits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

export function useCredits() {
  const [state, setState] = useState<StoredCredits>(DEFAULT_STATE);
  const [freeEvent, setFreeEvent] = useState(false);

  const loadAndReconcile = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = parseStored(raw);
      if (!parsed) return;
      const next = normalize(parsed);
      setState(next);
      if (raw !== JSON.stringify(next)) writeStored(next);
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    loadAndReconcile();
    // The admin flag is only a mirror of the server cookie; drop it if the
    // server no longer recognises the session (expired, code rotated, cleared).
    try {
      const stored = parseStored(localStorage.getItem(STORAGE_KEY));
      if (stored?.admin_expires_at) {
        fetch("/api/admin/session", { cache: "no-store" })
          .then((r) => r.json())
          .then((d: { admin?: boolean }) => {
            if (!d.admin) {
              const current = parseStored(localStorage.getItem(STORAGE_KEY));
              if (current) {
                delete current.admin_expires_at;
                writeStored(normalize(current));
              }
              loadAndReconcile();
            }
          })
          .catch(() => {});
      }
    } catch { /* ignore */ }
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

  const save = (next: StoredCredits) => {
    const normalized = normalize(next);
    setState(normalized);
    writeStored(normalized);
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
      passType: type,
      passExpiresAt: expiresAt.toISOString(),
    });
  };

  const purchaseCredits = (amount: number) => {
    save({ ...state, remaining: state.remaining + amount });
  };

  /** Turn on the admin mirror without touching an existing 7d/30d pass. */
  const activateAdmin = (expiresAt: string) => {
    save({ ...state, admin_expires_at: expiresAt });
  };

  /** Turn off the admin mirror; a real pass (if any) keeps working. */
  const deactivateAdmin = () => {
    if (!state.admin_expires_at) return;
    const next: StoredCredits = { ...state };
    delete next.admin_expires_at;
    save(next);
  };

  const isPhase2Free = state.hasPass || freeEvent;
  const isAdmin = Boolean(state.admin_expires_at);
  const hasRealPass = Boolean(state.passType);

  return {
    remaining: state.remaining,
    hasPass: state.hasPass,
    passType: state.passType,
    passExpiresAt: state.passExpiresAt,
    adminExpiresAt: state.admin_expires_at,
    hasRealPass,
    useCredit,
    canScan,
    purchasePass,
    purchaseCredits,
    activateAdmin,
    deactivateAdmin,
    isAdmin,
    freeEvent,
    isPhase2Free,
  };
}
