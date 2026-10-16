"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { DishEnrichment, MenuAnalysisResult } from "@/lib/types";
import { mergeEnrichment } from "@/lib/normalize-dish";
import type { StoredMenuInput } from "./useDishDetail";

// Streaming scans return the dish list first (names, translations, prices).
// This hook fills in allergen, diet and calorie fields from /api/analyze/enrich
// in chunks, a few at a time, and saves progress to the cached result.

const CHUNK_SIZE = 20;
const CONCURRENCY = 3;

interface Options {
  data: MenuAnalysisResult | null;
  setData: Dispatch<SetStateAction<MenuAnalysisResult | null>>;
  menuInput: StoredMenuInput | null;
  resultKey: string;
  /** False when the stored menu input belongs to another scan. */
  enabled: boolean;
}

export interface MenuEnrichmentState {
  pending: number;
  total: number;
  running: boolean;
  /** Request id of the last failed chunk, when any chunk failed. */
  errorRef: string | null;
  failed: boolean;
  /** Dishes are pending but this result's menu input is gone, so they cannot be analyzed here. */
  unavailable: boolean;
  retry: () => void;
}

function persist(resultKey: string, result: MenuAnalysisResult) {
  if (!resultKey) return;
  try {
    const cache = JSON.parse(localStorage.getItem("transtaste_cached_results") || "{}");
    if (!cache[resultKey]) return;
    cache[resultKey] = result;
    localStorage.setItem("transtaste_cached_results", JSON.stringify(cache));
  } catch { /* storage full or blocked: the in-memory result still updates */ }
}

export function useMenuEnrichment({ data, setData, menuInput, resultKey, enabled }: Options): MenuEnrichmentState {
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorRef, setErrorRef] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const dataRef = useRef(data);
  dataRef.current = data;

  const pending = data ? data.dishes.filter((d) => d.analysis_pending).length : 0;
  const hasPending = pending > 0;

  useEffect(() => {
    const current = dataRef.current;
    if (!enabled || !menuInput || !current || !hasPending) return;

    const names = current.dishes
      .filter((d) => d.analysis_pending && d.item_id)
      .map((d) => ({ id: d.item_id as string, original: d.original, category: d.category }));
    const chunks: (typeof names)[] = [];
    for (let i = 0; i < names.length; i += CHUNK_SIZE) chunks.push(names.slice(i, i + CHUNK_SIZE));

    const controller = new AbortController();
    let anyFailed = false;
    setRunning(true);
    setFailed(false);
    setErrorRef(null);

    const runChunk = async (chunk: typeof names) => {
      try {
        const res = await fetch("/api/analyze/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: menuInput.input,
            inputType: menuInput.inputType,
            outputLanguage: menuInput.outputLanguage,
            allergenPreset: menuInput.allergenPreset,
            dietaryBeliefs: menuInput.dietaryBeliefs,
            dislikedIngredients: menuInput.dislikedIngredients,
            dishes: chunk,
          }),
          signal: controller.signal,
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok || body.error || !Array.isArray(body.dishes)) {
          anyFailed = true;
          setErrorRef(body.ref || res.headers.get("x-request-id"));
          return;
        }
        const entries = body.dishes as DishEnrichment[];
        if (entries.length < chunk.length) anyFailed = true;
        setData((prev) => {
          if (!prev) return prev;
          const next = { ...prev, dishes: mergeEnrichment(prev.dishes, entries) };
          persist(resultKey, next);
          return next;
        });
      } catch {
        if (!controller.signal.aborted) anyFailed = true;
      }
    };

    const queue = [...chunks];
    const worker = async () => {
      while (queue.length && !controller.signal.aborted) {
        await runChunk(queue.shift()!);
      }
    };

    Promise.all(Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, worker)).then(() => {
      if (controller.signal.aborted) return;
      setRunning(false);
      setFailed(anyFailed);
    });

    return () => controller.abort();
    // Runs once per scan and per retry; dish updates from this run must not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, menuInput, resultKey, attempt, hasPending]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { pending, total: data?.dishes.length ?? 0, running: running && hasPending, errorRef, failed: failed && hasPending, unavailable: hasPending && !enabled, retry };
}
