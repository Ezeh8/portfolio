"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { StoryDialog } from "./StoryDialog";

type Page = { src: string; alt: string };

// A project's "View →" when it has view-only pages instead of a link: opens them one under
// another in the full-screen overlay. The pages are watermarked images (no PDF is served);
// saving them is discouraged, not prevented: no right-click menu, no dragging, no
// long-press callout, no selection.
export function PageViewer({ title, subtitle, pages }: { title: string; subtitle: string; pages: readonly Page[] }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={opener}
        type="button"
        aria-haspopup="dialog"
        aria-label={`View ${title}`}
        onClick={() => setOpen(true)}
        className="group shrink-0 cursor-pointer whitespace-nowrap text-sm font-semibold max-lg:self-end max-lg:py-1"
      >
        {/* the same look as the cards' "View →" links */}
        <span className="chrome">View</span>
        <span className="chrome ml-1 inline-block font-mono transition-transform duration-150 motion-safe:group-hover:translate-x-1">
          →
        </span>
      </button>

      {open && (
        <StoryDialog
          id="project-pages"
          title={title}
          subtitle={subtitle}
          keepCase
          chrome
          wide
          onClosed={() => {
            setOpen(false);
            opener.current?.focus();
          }}
        >
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            Excerpt · {pages.length} pages · view only
          </p>
          <div
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="mt-8 flex flex-col gap-6 select-none [-webkit-touch-callout:none]"
          >
            {pages.map((page, i) => (
              <Image
                key={page.src}
                src={page.src}
                alt={page.alt}
                width={2160}
                height={1215}
                draggable={false}
                priority={i === 0}
                sizes="(min-width: 1120px) 1056px, calc(100vw - 32px)"
                className="h-auto w-full rounded-lg border-(length:--border-width) border-line"
              />
            ))}
          </div>
        </StoryDialog>
      )}
    </>
  );
}
