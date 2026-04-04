"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DishLite, DishDetail } from "@/lib/types";

interface StoredMenuInput {
  input: string;
  inputType: "image" | "url" | "text";
  outputLanguage?: string;
  allergenPreset?: string[];
  dietaryBeliefs?: string[];
}

interface UseDishDetailReturn {
  detail: DishDetail | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useDishDetail(
  dish: DishLite | null,
  menuInput: StoredMenuInput | null,
): UseDishDetailReturn {
  const [detail, setDetail] = useState<DishDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, DishDetail>>(new Map());
  const [retryCount, setRetryCount] = useState(0);

  const fetchDetail = useCallback(async () => {
    if (!dish || !menuInput) return;

    const cacheKey = dish.original;

    // Check in-memory cache
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setDetail(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetail(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      try {
        const userKey = localStorage.getItem("transtaste_api_key");
        if (userKey) headers["x-api-key"] = userKey;
      } catch { /* ignore */ }

      const res = await fetch("/api/analyze/detail", {
        method: "POST",
        headers,
        body: JSON.stringify({
          input: menuInput.input,
          inputType: menuInput.inputType,
          dishOriginal: dish.original,
          dishCategory: dish.category,
          outputLanguage: menuInput.outputLanguage,
          allergenPreset: menuInput.allergenPreset,
          dietaryBeliefs: menuInput.dietaryBeliefs,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.reason || "Failed to load detail");
      }

      cacheRef.current.set(cacheKey, data);
      setDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- retryCount triggers re-fetch via useEffect below
  }, [dish, menuInput]);

  useEffect(() => {
    if (dish) {
      fetchDetail();
    } else {
      setDetail(null);
      setIsLoading(false);
      setError(null);
    }
  }, [dish, fetchDetail, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return { detail, isLoading, error, retry };
}

export type { StoredMenuInput };
