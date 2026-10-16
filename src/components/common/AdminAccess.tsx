"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface AdminAccessProps {
  isAdmin: boolean;
  expiresAt?: string;
  onActivate: (expiresAt: string) => void;
  onDeactivate: () => void;
}

/** Shared expiry formatter so the usage card and admin card always match. */
export function formatExpiryDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Owner access code entry. The code is checked server-side; nothing secret is stored in the browser. */
export default function AdminAccess({ isAdmin, expiresAt, onActivate, onDeactivate }: AdminAccessProps) {
  const { t, locale } = useTranslation();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.admin && data.expiresAt) {
        onActivate(data.expiresAt);
        setCode("");
      } else if (res.status === 401) {
        setError(t("profile.adminInvalid"));
      } else if (res.status === 429) {
        setError(t("profile.adminTooMany"));
      } else {
        setError(t("profile.adminUnavailable"));
      }
    } catch {
      setError(t("profile.adminUnavailable"));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        onDeactivate();
      } else {
        // Cookie may still be set server-side; keep admin state so UI matches.
        setError(t("profile.adminSignOutFailed"));
      }
    } catch {
      setError(t("profile.adminSignOutFailed"));
    } finally {
      setBusy(false);
    }
  };

  const expiry = expiresAt ? formatExpiryDate(expiresAt, locale) : "";

  return (
    <div id="profile-admin" className="scroll-mt-16 bg-cream-dark rounded-xl p-4">
      <h2 className="text-sm font-medium text-brown-medium uppercase tracking-caps mb-1">
        {t("profile.adminTitle")}
      </h2>

      {isAdmin ? (
        <>
          <p className="text-sm font-semibold text-brown-dark">{t("profile.adminActive")}</p>
          {expiry && (
            <p className="text-xs text-brown-medium mt-1">{t("profile.expires", { date: expiry })}</p>
          )}
          <button
            type="button"
            onClick={signOut}
            disabled={busy}
            className="mt-2 text-sm font-medium text-coral hover:text-coral-dark transition-colors"
          >
            {t("profile.adminSignOut")}
          </button>
          {error && <p role="alert" className="text-xs text-danger mt-2">{error}</p>}
        </>
      ) : (
        <form onSubmit={unlock}>
          <p className="text-xs text-brown-medium mb-2">{t("profile.adminDesc")}</p>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="admin-code">{t("profile.adminTitle")}</label>
            <input
              id="admin-code"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("profile.adminPlaceholder")}
              className="min-w-0 flex-1 bg-cream border border-brown-light/20 rounded-lg px-3 py-2.5 text-sm text-brown-dark focus:outline-none focus:ring-2 focus:ring-coral/30"
            />
            <button
              type="submit"
              disabled={busy || !code.trim()}
              className="shrink-0 rounded-lg bg-coral px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {t("profile.adminUnlock")}
            </button>
          </div>
          {error && <p role="alert" className="text-xs text-danger mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
}
