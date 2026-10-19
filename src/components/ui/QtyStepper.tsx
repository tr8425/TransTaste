"use client";

import { useRef } from "react";

interface QtyStepperProps {
  value: number;
  onChange: (next: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  max?: number;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROW = 1.25; // rem, matches .tt-odo line height

// Quantity stepper whose digits roll like an odometer. Going to 0 is allowed
// (the cart removes the item); pushing past max shakes the stepper instead.
export default function QtyStepper({ value, onChange, decreaseLabel, increaseLabel, max = 99 }: QtyStepperProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const tens = Math.floor(value / 10) % 10;
  const ones = value % 10;

  const bump = (d: number) => {
    const next = value + d;
    if (next > max) {
      const el = groupRef.current;
      if (el) {
        el.classList.remove("tt-shake");
        void el.offsetWidth;
        el.classList.add("tt-shake");
      }
      return;
    }
    onChange(next);
  };

  return (
    <div ref={groupRef} role="group" className="flex items-center gap-1 rounded-full bg-cream-dark p-1">
      <button
        type="button"
        onClick={() => bump(-1)}
        className="tt-step-b flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-brown-dark"
        aria-label={decreaseLabel}
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M5 10h10" /></svg>
      </button>
      <span className="tt-odo min-w-[1.5rem] text-sm font-bold text-brown-dark">
        <span className="sr-only" aria-live="polite" aria-atomic="true">{value}</span>
        <span className={`tt-odo-col ${tens === 0 ? "is-hide" : ""}`} style={{ transform: `translateY(${-tens * ROW}rem)` }} aria-hidden="true">
          {DIGITS.map((d) => <span key={d}>{d}</span>)}
        </span>
        <span className="tt-odo-col" style={{ transform: `translateY(${-ones * ROW}rem)` }} aria-hidden="true">
          {DIGITS.map((d) => <span key={d}>{d}</span>)}
        </span>
      </span>
      <button
        type="button"
        onClick={() => bump(1)}
        aria-disabled={value >= max}
        className="tt-step-b flex h-7 w-7 items-center justify-center rounded-full bg-brown-dark text-cream"
        aria-label={increaseLabel}
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M10 5v10M5 10h10" /></svg>
      </button>
    </div>
  );
}
