"use client";

import type { ReactNode } from "react";

interface ChoiceChipProps {
  selected: boolean;
  onClick: () => void;
  className: string;
  children: ReactNode;
  /** Shown above the label (e.g. an emoji) in stacked chips */
  leading?: ReactNode;
}

// Toggle chip whose check mark slides in from the left when selected.
// Layout and colors stay with the caller; .tt-chip only adds the motion.
export default function ChoiceChip({ selected, onClick, className, children, leading }: ChoiceChipProps) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`tt-chip ${className}`}>
      {leading}
      <span className="inline-flex items-center justify-center">
        <i className="tt-chip-check" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.4" /></svg>
        </i>
        {children}
      </span>
    </button>
  );
}
