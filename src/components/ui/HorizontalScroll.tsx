"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { useTranslation } from "@/lib/i18n";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  /** Extra gap class for the flex container (default: "gap-2") */
  gap?: string;
}

export default function HorizontalScroll({
  children,
  className = "",
  gap = "gap-2",
}: HorizontalScrollProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative group ${className}`}>
      <div
        ref={scrollRef}
        className={`flex ${gap} overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1`}
      >
        {children}
      </div>

      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-cream to-transparent md:hidden"
        />
      )}

      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-cream to-transparent md:hidden"
        />
      )}

      {/* Left arrow — PC only (hover group) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-white shadow-md border border-brown-light/20 text-brown-dark hover:bg-cream-dark transition-colors opacity-0 group-hover:opacity-100"
          aria-label={t("common.aria.scrollLeft")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Right arrow — PC only (hover group) */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-white shadow-md border border-brown-light/20 text-brown-dark hover:bg-cream-dark transition-colors opacity-0 group-hover:opacity-100"
          aria-label={t("common.aria.scrollRight")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
