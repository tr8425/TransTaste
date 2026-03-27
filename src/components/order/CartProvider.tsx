"use client";

import { ReactNode } from "react";
import { CartContext, useCartProvider } from "@/hooks/useCart";

export default function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCartProvider();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}
