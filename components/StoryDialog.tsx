"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

// The full-screen story overlay, used by the About section's "the whole story". Escape or
// the close button shuts it, as does a click on anything inside marked
// `data-story-close`. It is portalled to <body>, since a glass card's backdrop-filter
// would otherwise trap a fixed element.
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
      {/* z-10: above the content, which GSAP's lift turns into a layer of its own that would
          otherwise cover the button on phones (where the content runs edge to edge) */}
      <button
        ref={closeBtn}
        type="button"
        aria-label="Close"
        onClick={close}
        className="fixed top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-(length:--border-width) border-line text-lg transition-[background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome-smooth)] hover:text-btn-text sm:top-6 sm:right-6"
      >
        ✕
      </button>

      <div
        ref={content}
        onClick={(e) => (e.target as Element).closest("[data-story-close]") && close()}
        className="mx-auto max-w-[640px] px-4 py-20 sm:px-8 sm:py-24"
      >
        {/* sized so the About headline's longer line ("i own the maps & specs") fits the
            column: two lines, never three */}
        <h2
          id={titleId}
          className={`font-display text-[min(2.25rem,calc((100vw-32px)/13.5))] font-extrabold text-btn-ink sm:text-[min(3rem,calc((min(100vw,640px)-64px)/13.5))] ${keepCase ? "whitespace-pre-line" : "lowercase"}`}
        >
          {/* chrome line by line, like a multi-line section headline (see Headline) */}
          {chrome ? <span className="chrome chrome-lines">{title}</span> : title}
        </h2>
        {subtitle && <p className="mt-2 font-display text-sm font-normal text-text-muted">{subtitle}</p>}
        {children}
      </div>
    </div>,
    document.body,
  );
}
