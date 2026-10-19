"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

// Measures the child marked data-active="true" inside the returned ref and
// gives a style that moves a .tt-pill under it (rows and grids alike). The
// pill must share the active child's offsetParent. The ref is a callback so
// containers that mount later (after data loads) are still measured.
export function useSlidingPill<T extends HTMLElement>(activeKey: string | null) {
  const [node, setNode] = useState<T | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});
  const [off, setOff] = useState(activeKey == null);
  const measured = useRef(false);

  useLayoutEffect(() => {
    if (!node) return;
    const place = () => {
      const el = node.querySelector<HTMLElement>('[data-active="true"]');
      setOff(!el);
      if (!el) return;
      const next = {
        "--x": `${el.offsetLeft}px`,
        "--y": `${el.offsetTop}px`,
        "--w": `${el.offsetWidth}px`,
        "--h": `${el.offsetHeight}px`,
      } as CSSProperties;
      // First placement jumps; later ones slide.
      setStyle(measured.current ? next : { ...next, transition: "none" });
      measured.current = true;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(node);
    return () => ro.disconnect();
  }, [node, activeKey]);

  return { ref: setNode, pillStyle: style, pillOff: off };
}
