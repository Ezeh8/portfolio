"use client";

import { useEffect, useState, type CSSProperties } from "react";

// Cycles through `words` in place: the current word slides up and fades out as the next
// one rises in. Every word sits in the same grid cell, so the box always takes the width
// of the longest word and nothing beside it shifts. Hidden from screen readers; the
// caller gives the full sentence as visually hidden text. Under reduced motion the first
// word stays put.
const HOLD_MS = 1500;

export function RotatingWord({
  words,
  className = "",
  wordClassName = "",
  style,
}: {
  words: string[];
  className?: string;
  // added to each word, e.g. for text effects that must sit on the moving element itself
  wordClassName?: string;
  style?: CSSProperties;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <span aria-hidden="true" className={`inline-grid overflow-hidden pb-[0.12em] ${className}`} style={style}>
      {words.map((word, i) => {
        const offset = (i - index + words.length) % words.length;
        // 0 = showing, 1 = next up (waits below), anything else = just left (above)
        const state =
          offset === 0
            ? "translate-y-0 opacity-100"
            : offset === 1
              ? "translate-y-full opacity-0"
              : "-translate-y-full opacity-0";
        return (
          <span
            key={word}
            className={`[grid-area:1/1] transition-[translate,opacity] duration-500 ease-out ${state} ${wordClassName}`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
