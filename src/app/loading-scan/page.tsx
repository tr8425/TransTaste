"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { DishLite } from "@/lib/types";
import { FUN_FACTS_LOADING_COUNT } from "@/lib/constants";
import FunFactCard from "@/components/common/FunFactCard";
import { useCredits } from "@/hooks/useCredits";
import { useTranslation } from "@/lib/i18n";

const FOOD_EMOJIS = ["🍜", "🍣", "🥘", "🍛", "🍲", "🥟", "🍝", "🌮"];
const TIMEOUT_MS = 180_000; // 3 minutes

interface MenuMeta {
  language?: string;
  restaurant_type?: string;
  items_found?: number;
}

export default function LoadingScanPage() {
  const router = useRouter();
  const credits = useCredits();
  const creditsRef = useRef(credits);
  creditsRef.current = credits;
  const { t } = useTranslation();
  const tRef = useRef(t);
  tRef.current = t;
  const [dishes, setDishes] = useState<DishLite[]>([]);
  const [menuMeta, setMenuMeta] = useState<MenuMeta | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [emojiIndex, setEmojiIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const navigatedRef = useRef(false);
  const startedRef = useRef(false);
  const creditUsedRef = useRef(false);

  useEffect(() => {
    setFactIndex(Math.floor(Math.random() * FUN_FACTS_LOADING_COUNT));
  }, []);

  // Cycle emoji
  useEffect(() => {
    const timer = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % FOOD_EMOJIS.length);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Cycle fun facts every 8s
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS_LOADING_COUNT);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const navigateToResults = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    router.push("/results");
  }, [router]);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (startedRef.current) return;
    startedRef.current = true;

    const inputType = sessionStorage.getItem("scanInputType") as "image" | "url" | "text" | null;
    const imageData = sessionStorage.getItem("scanImage");
    const textData = sessionStorage.getItem("scanText");

    let input: string | null = null;
    let type: "image" | "url" | "text" = "image";

    if (inputType === "text" && textData) {
      input = textData;
      type = "text";
    } else if (inputType === "url" && imageData) {
      input = imageData;
      type = "url";
    } else if (imageData) {
      input = imageData;
      type = "image";
    }

    if (!input) {
      sessionStorage.setItem("scanError", "E_NO_INPUT");
      navigateToResults();
      return;
    }

    // Credit check — read directly from localStorage to avoid race condition
    if (!creditUsedRef.current) {
      let canScan = false;
      try {
        const raw = localStorage.getItem("transtaste_credits");
        if (raw) {
          const stored = JSON.parse(raw);
          canScan = stored.hasPass || (stored.remaining > 0);
        } else {
          canScan = true; // first visit, default 10 credits
        }
      } catch {
        canScan = true;
      }

      if (!canScan) {
        sessionStorage.setItem("scanError", "E_NO_CREDITS");
        navigateToResults();
        return;
      }
      // Credit deduction deferred until valid response is confirmed
    }

    // Preserve menu input for Phase 2 detail requests
    sessionStorage.setItem("menuInputForDetail", JSON.stringify({
      input,
      inputType: type,
    }));

    sessionStorage.removeItem("scanImage");
    sessionStorage.removeItem("scanText");
    sessionStorage.removeItem("scanInputType");

    const abortController = new AbortController();
    abortRef.current = abortController;

    // 3-minute timeout
    const timeoutId = setTimeout(() => {
      abortController.abort();
      sessionStorage.setItem("scanError", "E_TIMEOUT");
      navigateToResults();
    }, TIMEOUT_MS);

    const consumeStream = async (res: Response) => {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });

        // Parse SSE events (double newline separated)
        const parts = sseBuffer.split("\n\n");
        sseBuffer = parts.pop()!;

        for (const part of parts) {
          if (!part.trim()) continue;
          const lines = part.split("\n");
          let eventType = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7);
            if (line.startsWith("data: ")) data += line.slice(6);
          }

          if (!eventType || !data) continue;

          try {
            const parsed = JSON.parse(data);

            if (eventType === "meta") {
              setMenuMeta(parsed);
            } else if (eventType === "dish") {
              setDishes((prev) => [...prev, parsed]);
            } else if (eventType === "done") {
              // Deduct credit only on successful analysis
              if (!creditUsedRef.current) {
                creditsRef.current.useCredit();
                creditUsedRef.current = true;
              }
              sessionStorage.setItem("scanResult", JSON.stringify(parsed));
              navigateToResults();
              return;
            } else if (eventType === "error") {
              sessionStorage.setItem("scanError", JSON.stringify({ error: parsed.error || 'E_UNKNOWN', reason: parsed.reason, _debug: parsed._debug }));
              navigateToResults();
              return;
            }
          } catch {
            // Skip malformed SSE event
          }
        }
      }

      // Stream ended without done/error event
      if (!navigatedRef.current) {
        sessionStorage.setItem("scanError", "E_STREAM_END");
        navigateToResults();
      }
    };

    const analyze = async () => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        let userSettings: Record<string, unknown> = {};
        try {
          const userKey = localStorage.getItem("transtaste_api_key");
          if (userKey) headers["x-api-key"] = userKey;
          const raw = localStorage.getItem("transtaste_user_settings");
          if (raw) userSettings = JSON.parse(raw);
        } catch { /* ignore */ }

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers,
          body: JSON.stringify({
            input,
            inputType: type,
            stream: true,
            outputLanguage: userSettings.output_language as string || undefined,
            allergenPreset: userSettings.allergen_preset as string[] || undefined,
            dietaryBeliefs: userSettings.dietary_beliefs as string[] || undefined,
            dislikedIngredients: userSettings.disliked_ingredients as string[] || undefined,
          }),
          signal: abortController.signal,
        });

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("text/event-stream")) {
          await consumeStream(res);
        } else {
          // JSON response (mock/cache)
          if (!res.ok) {
            const errBody = await res.text();
            throw new Error(errBody || `Server error: ${res.status}`);
          }
          const result = await res.json();
          // Deduct credit only on successful analysis
          if (!creditUsedRef.current) {
            creditsRef.current.useCredit();
            creditUsedRef.current = true;
          }
          sessionStorage.setItem("scanResult", JSON.stringify(result));
          navigateToResults();
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        const detail = err instanceof Error ? err.message : 'Unknown error';
        sessionStorage.setItem("scanError", JSON.stringify({ error: 'E_FETCH_FAIL', reason: detail }));
        navigateToResults();
      } finally {
        clearTimeout(timeoutId);
      }
    };

    analyze();

    return () => {
      clearTimeout(timeoutId);
      // Do NOT abort here — React Strict Mode cleanup would kill the in-flight request.
      // The 3-minute timeout and page navigation handle cleanup instead.
    };
  }, [router, navigateToResults]);

  const statusText =
    dishes.length > 0
      ? t("loading.found", { count: dishes.length })
      : menuMeta
        ? t("loading.scanning", { type: menuMeta.restaurant_type || "menu" })
        : t("loading.analyzing");

  const subtitleText = menuMeta
    ? `${menuMeta.language || ""} · ${menuMeta.restaurant_type || ""}`.replace(/^ · | · $/g, "")
    : t("loading.identifying");

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center px-6 overflow-y-auto">
      {/* Top loading section */}
      <div className="flex flex-col items-center pt-16 pb-4 flex-shrink-0">
        <div className="text-6xl mb-6 animate-bounce">
          {FOOD_EMOJIS[emojiIndex]}
        </div>
        <h2 className="text-lg font-semibold text-brown-dark mb-1">
          {statusText}
        </h2>
        <p className="text-sm text-brown-medium mb-4">{subtitleText}</p>

        {/* Progress bar (180s animation) */}
        <div className="w-48 h-1 bg-cream-dark rounded-full overflow-hidden mb-6">
          <div className="h-full bg-coral rounded-full animate-progress" />
        </div>
      </div>

      {/* Streaming dish previews */}
      {dishes.length > 0 && (
        <div className="w-full max-w-sm mb-6 flex-shrink-0">
          <p className="text-xs text-brown-medium mb-2 px-1">
            {t("loading.found", { count: dishes.length })}
            {menuMeta?.items_found ? ` / ~${menuMeta.items_found}` : ""}
          </p>
          <div className="space-y-1.5">
            {dishes.map((dish, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-4 py-2.5 shadow-sm animate-slideIn"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-brown-dark truncate">
                      {dish.translation?.english || dish.original}
                    </p>
                    <p className="text-xs text-brown-medium truncate">
                      {dish.original}
                    </p>
                    {dish.translation?.pronunciation && (
                      <p className="text-[10px] text-brown-medium/60 italic truncate">
                        {dish.translation.pronunciation}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-0.5 ml-2 flex-shrink-0">
                    {dish.price_display || dish.price ? (
                      <span className="text-xs text-brown-medium">
                        {dish.price_display || dish.price}
                      </span>
                    ) : null}
                    {dish.allergen_risk && dish.allergen_risk !== "safe" && (
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        dish.allergen_risk === "danger" ? "bg-danger text-white" :
                        dish.allergen_risk === "warning" ? "bg-amber-500 text-white" :
                        "bg-amber-500/20 text-amber-700"
                      }`}>
                        {dish.allergen_risk}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun fact */}
      <div className="w-full max-w-sm pb-8">
        <FunFactCard fact={t(`funFacts.${factIndex}`)} />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          5% {
            width: 10%;
          }
          15% {
            width: 25%;
          }
          30% {
            width: 40%;
          }
          50% {
            width: 55%;
          }
          70% {
            width: 70%;
          }
          85% {
            width: 82%;
          }
          100% {
            width: 95%;
          }
        }
        .animate-progress {
          animation: progress 180s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
