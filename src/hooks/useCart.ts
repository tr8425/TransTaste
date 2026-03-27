"use client";
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";


export interface CartItem {
  dish_hash: string;
  name_original: string;
  name_translated: string;
  price?: number;
  currency?: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  menuLanguage: string;
  userLanguage: string;
  countryDetected: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (dish_hash: string) => void;
  updateQuantity: (dish_hash: string, quantity: number) => void;
  clearCart: () => void;
  setMenuLanguage: (lang: string) => void;
  setUserLanguage: (lang: string) => void;
  setCountryDetected: (country: string) => void;
  totalItems: number;
  totalPrice: number;
}

const STORAGE_KEY = "transtaste_cart";

function loadFromSession(): {
  items: CartItem[];
  menuLanguage: string;
  userLanguage: string;
  countryDetected: string;
} {
  if (typeof window === "undefined") {
    return { items: [], menuLanguage: "en", userLanguage: "en", countryDetected: "" };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { items: [], menuLanguage: "en", userLanguage: "en", countryDetected: "" };
}

export const CartContext = createContext<CartContextType | null>(null);

export function useCartProvider() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [menuLanguage, setMenuLanguage] = useState("en");
  const [userLanguage, setUserLanguage] = useState("en");
  const [countryDetected, setCountryDetected] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const saved = loadFromSession();
    setItems(saved.items);
    setMenuLanguage(saved.menuLanguage);
    setUserLanguage(saved.userLanguage);
    setCountryDetected(saved.countryDetected);
    setHydrated(true);
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, menuLanguage, userLanguage, countryDetected })
      );
    } catch {
      /* ignore */
    }
  }, [items, menuLanguage, userLanguage, countryDetected, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dish_hash === item.dish_hash);
      if (existing) {
        return prev.map((i) =>
          i.dish_hash === item.dish_hash
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

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

  return useMemo<CartContextType>(
    () => ({
      items,
      menuLanguage,
      userLanguage,
      countryDetected,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setMenuLanguage,
      setUserLanguage,
      setCountryDetected,
      totalItems,
      totalPrice,
    }),
    [
      items,
      menuLanguage,
      userLanguage,
      countryDetected,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
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
