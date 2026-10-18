"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Topology } from "@/content/site";
import GraphPattern from "./GraphPattern";
import { useFitLine } from "./useFitLine";

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
  plainPills = false,
  fitGroup,
  className = "",
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  topology: Topology;
  pills: readonly string[];
  pillsLabel: string;
  // plain text instead of pill shapes, so the items line up with the title's left edge
  plainPills?: boolean;
  // cards sharing a fitGroup (one per section) size their one-line title, subtitle and
  // pills alike, so the lines align across the cards
  fitGroup?: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  // the title, subtitle and pills each stay on one line, shrinking to fit the card
  const titleRef = useFitLine<HTMLHeadingElement>(fitGroup && `${fitGroup}-title`);
  const subtitleRef = useFitLine<HTMLParagraphElement>(fitGroup && `${fitGroup}-subtitle`);

  return (
    <article
      id={id}
      className={`panel relative z-[2] flex h-full cursor-pointer flex-col overflow-hidden has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-accent-text ${className}`}
    >
      <div className="relative h-[180px] w-full shrink-0 border-b-(length:--border-width) border-line bg-bg">
        <GraphPattern topology={topology} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <h3
          ref={titleRef}
          className="overflow-hidden font-display text-2xl font-extrabold whitespace-nowrap lowercase text-btn-ink sm:text-3xl"
        >
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
        {subtitle && (
          <p
            ref={subtitleRef}
            className="mt-1 overflow-hidden font-display text-[13px] font-normal whitespace-nowrap text-text-muted"
          >
            {subtitle}
          </p>
        )}
        <Pills
          items={pills}
          label={pillsLabel}
          oneLine
          plain={plainPills}
          fitGroup={fitGroup && `${fitGroup}-pills`}
          className="mt-4"
        />
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

// A row of pills. `oneLine` keeps them on a single line, shrinking the row to fit; the
// padding and gaps are in em so they shrink with it.
export function Pills({
  items,
  label,
  oneLine = false,
  plain = false,
  fitGroup,
  className = "",
}: {
  items: readonly string[];
  label: string;
  oneLine?: boolean;
  plain?: boolean;
  fitGroup?: string;
  className?: string;
}) {
  const ref = useFitLine<HTMLUListElement>(fitGroup);
  return (
    <ul
      ref={oneLine ? ref : undefined}
      className={`flex gap-[0.8em] text-[10px] ${oneLine ? "flex-nowrap overflow-hidden" : "flex-wrap"} ${className}`}
      aria-label={label}
    >
      {items.map((item) => (
        <li
          key={item}
          className={`shrink-0 whitespace-nowrap uppercase tracking-[0.08em] text-card-alt-title ${plain ? "font-mono" : "rounded-full bg-[#16181e] px-[1em] py-[0.4em]"}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// The full-screen story overlay. Also used on its own (the About section's "the whole
// story"). A click on anything inside marked `data-story-close` closes it too.
export function StoryDialog({
  id,
  title,
  subtitle,
  keepCase = false,
  chrome = false,
  onClosed,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  // keep the title's case and its \n line breaks (card titles are lowercase)
  keepCase?: boolean;
  // a chrome (metallic) title, like the section headlines
  chrome?: boolean;
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

      <div
        ref={content}
        onClick={(e) => (e.target as Element).closest("[data-story-close]") && close()}
        className="mx-auto max-w-[640px] px-4 py-20 sm:px-8 sm:py-24"
      >
        <h2
          id={titleId}
          className={`font-display text-4xl font-extrabold text-btn-ink sm:text-5xl ${keepCase ? "whitespace-pre-line" : "lowercase"}${chrome ? " chrome" : ""}`}
        >
          {title}
        </h2>
        {subtitle && <p className="mt-2 font-display text-sm font-normal text-text-muted">{subtitle}</p>}
        {children}
      </div>
    </div>,
    document.body,
  );
}
