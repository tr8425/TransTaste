"use client";
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";


export interface CartItem {
  dish_hash: string;
  name_original: string;
  name_translated: string;
  price?: number;
  currency?: string;
  allergen_risk?: "danger" | "warning" | "check" | "safe";
  allergens?: string[];
  /** Result the item was added from (older carts may not have it). */
  source_key?: string;
  quantity: number;
}

export interface CurrencySubtotal {
  /** Currency code/symbol as stored on the items ("" when unknown). */
  currency: string;
  total: number;
}

/** Scan metadata recorded alongside items so the order card matches them. */
export interface CartSourceMeta {
  sourceResultKey: string;
  menuLanguage?: string;
  countryDetected?: string;
}

export interface CartContextType {
  items: CartItem[];
  menuLanguage: string;
  userLanguage: string;
  countryDetected: string;
  sourceResultKey: string;
  addItem: (item: Omit<CartItem, "quantity" | "source_key">, meta?: CartSourceMeta) => void;
  /** Clear the cart and add this item as the first line of a new order. */
  startNewOrderWith: (item: Omit<CartItem, "quantity" | "source_key">, meta?: CartSourceMeta) => void;
  /** True when adding `item` would mix menus or currencies in one order. */
  conflictsWithCart: (item: Pick<CartItem, "currency">, sourceKey?: string) => boolean;
  removeItem: (dish_hash: string) => void;
  updateQuantity: (dish_hash: string, quantity: number) => void;
  clearCart: () => void;
  setMenuLanguage: (lang: string) => void;
  setUserLanguage: (lang: string) => void;
  setCountryDetected: (country: string) => void;
  setSourceResultKey: (key: string) => void;
  totalItems: number;
  /** Sum of all prices. Only meaningful when `subtotals.length <= 1`. */
  totalPrice: number;
  /** One entry per currency in the cart (several only for legacy carts). */
  subtotals: CurrencySubtotal[];
}

/** Group item totals by currency so different currencies are never summed. */
export function subtotalsByCurrency(items: CartItem[]): CurrencySubtotal[] {
  const totals = new Map<string, number>();
  for (const item of items) {
    if (item.price == null) continue;
    const key = item.currency ?? "";
    totals.set(key, (totals.get(key) ?? 0) + item.price * item.quantity);
  }
  return Array.from(totals, ([currency, total]) => ({ currency, total }));
}

const STORAGE_KEY = "transtaste_cart";

function loadFromSession(): {
  items: CartItem[];
  menuLanguage: string;
  userLanguage: string;
  countryDetected: string;
  sourceResultKey: string;
} {
  if (typeof window === "undefined") {
    return { items: [], menuLanguage: "en", userLanguage: "en", countryDetected: "", sourceResultKey: "" };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { items: [], menuLanguage: "en", userLanguage: "en", countryDetected: "", sourceResultKey: "" };
}

export const CartContext = createContext<CartContextType | null>(null);

export function useCartProvider() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [menuLanguage, setMenuLanguage] = useState("en");
  const [userLanguage, setUserLanguage] = useState("en");
  const [countryDetected, setCountryDetected] = useState("");
  const [sourceResultKey, setSourceResultKey] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const saved = loadFromSession();
    setItems(saved.items);
    setMenuLanguage(saved.menuLanguage);
    setUserLanguage(saved.userLanguage);
    setCountryDetected(saved.countryDetected);
    setSourceResultKey(saved.sourceResultKey || "");
    setHydrated(true);
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, menuLanguage, userLanguage, countryDetected, sourceResultKey })
      );
    } catch {
      /* ignore */
    }
  }, [items, menuLanguage, userLanguage, countryDetected, sourceResultKey, hydrated]);

  const applyMeta = useCallback((meta?: CartSourceMeta) => {
    if (!meta) return;
    setSourceResultKey(meta.sourceResultKey);
    if (meta.menuLanguage) setMenuLanguage(meta.menuLanguage);
    if (meta.countryDetected) setCountryDetected(meta.countryDetected);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity" | "source_key">, meta?: CartSourceMeta) => {
      const source_key = meta?.sourceResultKey || undefined;
      setItems((prev) => {
        const existing = prev.find((i) => i.dish_hash === item.dish_hash);
        if (existing) {
          return prev.map((i) =>
            i.dish_hash === item.dish_hash
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { ...item, source_key, quantity: 1 }];
      });
      applyMeta(meta);
    },
    [applyMeta],
  );

  const startNewOrderWith = useCallback(
    (item: Omit<CartItem, "quantity" | "source_key">, meta?: CartSourceMeta) => {
      const source_key = meta?.sourceResultKey || undefined;
      setItems([{ ...item, source_key, quantity: 1 }]);
      applyMeta(meta);
    },
    [applyMeta],
  );

  const conflictsWithCart = useCallback(
    (item: Pick<CartItem, "currency">, sourceKey?: string) => {
      if (items.length === 0) return false;
      const currencyClash = items.some(
        (i) => (i.currency ?? "") !== (item.currency ?? ""),
      );
      if (currencyClash) return true;
      if (!sourceKey) return false;
      return items.some((i) => {
        const itemSource = i.source_key || sourceResultKey;
        return Boolean(itemSource) && itemSource !== sourceKey;
      });
    },
    [items, sourceResultKey],
  );

  const removeItem = useCallback((dish_hash: string) => {
    setItems((prev) => prev.filter((i) => i.dish_hash !== dish_hash));
  }, []);

  const updateQuantity = useCallback((dish_hash: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.dish_hash !== dish_hash));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.dish_hash === dish_hash ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0),
    [items]
  );

  const subtotals = useMemo(() => subtotalsByCurrency(items), [items]);

  return useMemo<CartContextType>(
    () => ({
      items,
      menuLanguage,
      userLanguage,
      countryDetected,
      sourceResultKey,
      addItem,
      startNewOrderWith,
      conflictsWithCart,
      removeItem,
      updateQuantity,
      clearCart,
      setMenuLanguage,
      setUserLanguage,
      setCountryDetected,
      setSourceResultKey,
      totalItems,
      totalPrice,
      subtotals,
    }),
    [
      items,
      menuLanguage,
      userLanguage,
      countryDetected,
      sourceResultKey,
      addItem,
      startNewOrderWith,
      conflictsWithCart,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      subtotals,
    ]
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
