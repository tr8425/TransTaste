"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface CollapseProps {
  open: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}

// Animated show/hide. Closed content stays mounted for the height animation
// but is made inert so it can't be focused or read.
export default function Collapse({ open, id, className = "", children }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.inert = !open;
  }, [open]);
  return (
    // The -m/p pair keeps rings and offset shadows from being clipped.
    <div ref={ref} id={id} className={`tt-collapse -m-1.5 ${open ? "is-open" : ""}`}>
      <div>
        <div className={`p-1.5 ${className}`}>{children}</div>
      </div>
    </div>
  );
}
