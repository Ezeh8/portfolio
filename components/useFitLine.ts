"use client";

import { useLayoutEffect, useRef } from "react";

// Keeps an element's content on one line by shrinking its font size until it fits its
// width. The element must not wrap (white-space: nowrap / flex-nowrap) and should size
// its padding and gaps in em, so they shrink with the text. Its CSS font size is the
// largest it gets. Re-fits whenever the element resizes (a hidden card has no width, so
// it is fitted when shown) and once the web fonts have loaded.
//
// Elements given the same `group` all take the smallest size any of them needs, so
// matching lines on neighbouring cards (titles, subtitles, tool rows) stay the same size
// and line up.
const groups = new Map<string, Set<HTMLElement>>();

// The font size (px) at which el fits on one line, or null if it has no width (hidden).
function needed(el: HTMLElement) {
  el.style.removeProperty("font-size");
  const room = el.clientWidth;
  if (room === 0) return null;
  const max = parseFloat(getComputedStyle(el).fontSize);
  const need = el.scrollWidth;
  // a hair under the exact ratio, so rounding never tips it back over
  return need <= room ? max : Math.floor(((max * room) / need) * 0.98 * 10) / 10;
}

function fitGroup(members: Iterable<HTMLElement>) {
  const sizes = new Map<HTMLElement, number>();
  for (const el of members) {
    const size = needed(el);
    if (size !== null) sizes.set(el, size);
  }
  if (sizes.size === 0) return;
  const smallest = Math.min(...sizes.values());
  for (const el of sizes.keys()) el.style.fontSize = `${smallest}px`;
}

export function useFitLine<T extends HTMLElement>(group?: string) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let members: Set<HTMLElement> = new Set([el]);
    if (group) {
      members = groups.get(group) ?? new Set();
      groups.set(group, members);
      members.add(el);
    }
    const fit = () => fitGroup(members);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    document.fonts?.ready.then(fit);
    return () => {
      observer.disconnect();
      members.delete(el);
    };
  }, [group]);

  return ref;
}
