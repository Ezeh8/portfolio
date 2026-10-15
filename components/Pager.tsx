"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Shared by the Work and Experience sections: cards shown PER_PAGE at a time, a numbered
// pager (one number per page, so it grows as cards are added), previous / next, a
// horizontal swipe on touch screens, and "see all" to show every card. Hidden cards stay
// in the page with the `hidden` attribute, so their ids still exist.
export const PER_PAGE = 2;
const SWIPE = 50; // px of horizontal travel that counts as a swipe

const pagerBtn =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border-(length:--border-width) border-line px-2 transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95";

export function usePager(count: number) {
  const [page, setPage] = useState(0);
  const [all, setAll] = useState(false);
  const pages = Math.ceil(count / PER_PAGE);
  const go = (p: number) => setPage((p + pages) % pages);
  const touch = useRef<{ x: number; y: number } | null>(null);

  // The page length changes, so scroll-driven effects (the plane, reveals) re-measure.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [page, all]);

  return {
    page,
    pages,
    all,
    go,
    toggleAll: () => setAll((v) => !v),
    // whether the card at index i is on screen
    shows: (i: number) => all || Math.floor(i / PER_PAGE) === page,
    // for the list element: a mostly-horizontal swipe turns the page; vertical scrolling
    // is left alone
    swipe: {
      onTouchStart: (e: TouchEvent) => {
        if (all) return;
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      },
      onTouchEnd: (e: TouchEvent) => {
        const start = touch.current;
        touch.current = null;
        if (!start || all) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(t.clientY - start.y))
          go(page + (dx < 0 ? 1 : -1));
      },
    },
  };
}

// The controls under the cards. `names` labels each card for screen readers; `noun` is
// the plural used in the labels ("projects", "roles").
export function Pager({
  pager,
  names,
  noun,
}: {
  pager: ReturnType<typeof usePager>;
  names: string[];
  noun: string;
}) {
  const { page, pages, all, go, toggleAll } = pager;
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
      {all ? (
        <span className="text-text-muted">
          all {names.length} {noun}
        </span>
      ) : (
        <nav aria-label={noun[0].toUpperCase() + noun.slice(1)} className="flex items-center gap-2">
          <button type="button" onClick={() => go(page - 1)} aria-label={`Previous ${noun}`} className={pagerBtn}>
            ←
          </button>
          {Array.from({ length: pages }, (_, p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-label={`Page ${p + 1} of ${pages}: ${names.slice(p * PER_PAGE, (p + 1) * PER_PAGE).join(" and ")}`}
              aria-current={p === page || undefined}
              className={`${pagerBtn} aria-[current]:bg-btn-bg aria-[current]:bg-[image:var(--chrome)] aria-[current]:text-btn-text`}
            >
              {String(p + 1).padStart(2, "0")}
            </button>
          ))}
          <button type="button" onClick={() => go(page + 1)} aria-label={`Next ${noun}`} className={pagerBtn}>
            →
          </button>
        </nav>
      )}
      <button
        type="button"
        onClick={toggleAll}
        aria-expanded={all}
        className="inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
      >
        {all ? `show ${PER_PAGE} at a time` : `see all (${names.length})`}
      </button>
    </div>
  );
}
