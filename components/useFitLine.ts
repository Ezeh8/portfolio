"use client";

import { useLayoutEffect, useRef } from "react";

// Keeps an element's content on one line by shrinking its font size until it fits its
// width. The element must not wrap (white-space: nowrap / flex-nowrap) and should size
// its padding and gaps in em, so they shrink with the text. Its CSS font size is the
// largest it gets. Re-fits whenever the element resizes (a hidden card has no width, so
// it is fitted when shown) and once the web fonts have loaded.
export function useFitLine<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.removeProperty("font-size");
      const room = el.clientWidth;
      const need = el.scrollWidth;
      if (room === 0 || need <= room) return;
      const max = parseFloat(getComputedStyle(el).fontSize);
      // a hair under the exact ratio, so rounding never tips it back over
      el.style.fontSize = `${Math.floor(((max * room) / need) * 0.98 * 10) / 10}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  return ref;
}
