"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Topology } from "@/content/site";
import GraphPattern from "./GraphPattern";

gsap.registerPlugin(useGSAP);

// The card shared by the Work and Experience sections: a cover with a graph pattern, the
// title (and subtitle, if any), then a row of pills. Clicking anywhere on it opens the
// full story (`children`) in a full-screen overlay; Escape or the close button shuts it.
// The card keeps `id`, which the plane and the reveal effects look up. The overlay is
// portalled to <body>, since the card's tilt and float transforms would otherwise trap a
// fixed element.
export default function StoryCard({
  id,
  title,
  subtitle,
  topology,
  pills,
  pillsLabel,
  className = "",
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  topology: Topology;
  pills: readonly string[];
  pillsLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);

  return (
    <article
      id={id}
      className={`panel relative z-[2] flex h-full cursor-pointer flex-col overflow-hidden has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-accent-text ${className}`}
    >
      <div className="relative h-[180px] w-full shrink-0 border-b-(length:--border-width) border-line bg-bg">
        <GraphPattern topology={topology} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <h3 className="font-display text-2xl font-extrabold lowercase text-btn-ink sm:text-3xl">
          {/* the title is the card's button; its ::before stretches over the whole card */}
          <button
            ref={opener}
            type="button"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            className="cursor-pointer text-left lowercase outline-none before:absolute before:inset-0 before:z-[1] before:content-['']"
          >
            {title}
          </button>
        </h3>
        {subtitle && <p className="mt-1 font-display text-[13px] font-normal text-text-muted">{subtitle}</p>}
        <Pills items={pills} label={pillsLabel} className="mt-4" />
      </div>

      {open && (
        <StoryDialog
          id={id}
          title={title}
          subtitle={subtitle}
          onClosed={() => {
            setOpen(false);
            opener.current?.focus();
          }}
        >
          {children}
        </StoryDialog>
      )}
    </article>
  );
}

export function Pills({
  items,
  label,
  className = "",
}: {
  items: readonly string[];
  label: string;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={label}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full bg-[#16181e] px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-card-alt-title"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// Small uppercase label used between the parts of a story.
export function StoryLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">{children}</p>;
}

function StoryDialog({
  id,
  title,
  subtitle,
  onClosed,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  onClosed: () => void;
  children: ReactNode;
}) {
  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const titleId = `${id}-dialog-title`;

  // open: fade the overlay in, then lift the content into place
  useGSAP(() => {
    gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(
      content.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
    );
  });

  // close: fade out, then unmount (only ever called from the button or Escape)
  const close = useCallback(() => {
    gsap.to(overlay.current, { opacity: 0, duration: 0.2, onComplete: onClosed });
  }, [onClosed]);

  useEffect(() => {
    closeBtn.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return createPortal(
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      // Lenis leaves wheel and touch scrolling inside the overlay to the browser
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto bg-bg/97"
    >
      <button
        ref={closeBtn}
        type="button"
        aria-label="Close"
        onClick={close}
        className="fixed top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-(length:--border-width) border-line text-lg transition-[background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text sm:top-6 sm:right-6"
      >
        ✕
      </button>

      <div ref={content} className="mx-auto max-w-[640px] px-4 py-20 sm:px-8 sm:py-24">
        <h2 id={titleId} className="font-display text-4xl font-extrabold lowercase text-btn-ink sm:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 font-display text-sm font-normal text-text-muted">{subtitle}</p>}
        {children}
      </div>
    </div>,
    document.body,
  );
}
