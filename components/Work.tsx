"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import {
  Container,
  Glyphs,
  HandNote,
  Headline,
  PanelBar,
  SectionLabel,
  StatusDot,
  isExternal,
} from "./ui";

// A different small tilt per card from 1024px up; flat below, so the phone flight is unaffected.
const tilts = ["lg:[--tilt:-1deg]", "lg:[--tilt:0.75deg]", "lg:[--tilt:0.5deg]", "lg:[--tilt:-1deg]"];

const pagerBtn =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border-(length:--border-width) border-line px-2 transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95";

// Tinted cards: the Evaluate toolkit card's grey, with muted labels in its title grey.
const tint = "bg-card-alt [--text-muted:var(--card-alt-title)]";


// Two project cards per page, side by side from 768px (stacked on phones), with a
// numbered pager (one number per page, so it grows as projects are added), previous /
// next, and a horizontal swipe on touch screens. "see all" shows every card.
// Hidden cards stay in the page with the `hidden` attribute, so their ids still exist.
const PER_PAGE = 2;
const SWIPE = 50; // px of horizontal travel that counts as a swipe

export default function Work() {
  const { label, headline, note, panelStatus, linkLabel, projects } = site.work;
  const [page, setPage] = useState(0);
  const [all, setAll] = useState(false);
  const count = projects.length;
  const pages = Math.ceil(count / PER_PAGE);
  const go = (p: number) => setPage((p + pages) % pages);
  const touch = useRef<{ x: number; y: number } | null>(null);

  // The page length changes, so scroll-driven effects (the plane, reveals) re-measure.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [page, all]);

  return (
    <section id="work" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <Headline copy={headline} className="text-[clamp(2.25rem,5vw,3.5rem)]" />
          <HandNote arrow="down" className="-rotate-2 self-start md:mb-2 md:self-auto">
            {note}
          </HandNote>
        </div>

        <ul
          className="mt-10 grid gap-12 md:grid-cols-2 md:gap-x-8 lg:gap-8"
          // a mostly-horizontal swipe turns the page; vertical scrolling is left alone
          onTouchStart={(e) => {
            if (all) return;
            const t = e.touches[0];
            touch.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touch.current;
            touch.current = null;
            if (!start || all) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(t.clientY - start.y))
              go(page + (dx < 0 ? 1 : -1));
          }}
        >
          {projects.map((project, i) => (
            <li
              key={project.id}
              hidden={!all && Math.floor(i / PER_PAGE) !== page}
              className="motion-safe:animate-[card-in_350ms_ease-out]"
            >
              <article
                id={project.id}
                className={`panel relative z-[2] flex h-full flex-col overflow-hidden ${tilts[i % tilts.length]}${project.tinted ? ` ${tint}` : ""}`}
              >
                <PanelBar className={project.tinted ? "text-card-alt-title" : ""}>
                  <span className="flex items-center gap-2">
                    <StatusDot />
                    {panelStatus}
                  </span>
                  <span className="text-text-muted">scan-{String(i + 1).padStart(2, "0")}</span>
                </PanelBar>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">{project.name}</h3>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-text/75">{project.description}</p>

                  {project.chips.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                      {project.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full border-(length:--border-width) border-line px-2.5 py-0.5 font-mono text-xs"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-8">
                    {/* dashed until the card reaches mid-screen; CardHighlights sets data-lit */}
                    <p
                      data-readout
                      className="border-t-(length:--border-width) border-dashed border-accent-text pt-3 font-mono text-sm text-accent-text transition-colors duration-300 data-[lit]:border-solid data-[lit]:bg-accent-soft data-[lit]:text-text"
                    >
                      {project.readout}
                    </p>
                    {project.href && (
                      <a
                        href={project.href}
                        {...(isExternal(project.href) && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                        className="mt-4 inline-block text-sm font-medium underline decoration-2 underline-offset-4 transition-[color,text-underline-offset] duration-150 hover:text-accent-text hover:underline-offset-[7px]"
                      >
                        <Glyphs text={linkLabel} />
                        <span className="sr-only">: {project.name}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {all ? (
            <span className="text-text-muted">all {count} projects</span>
          ) : (
            <nav aria-label="Projects" className="flex items-center gap-2">
              <button type="button" onClick={() => go(page - 1)} aria-label="Previous projects" className={pagerBtn}>
                ←
              </button>
              {Array.from({ length: pages }, (_, p) => {
                const shown = projects.slice(p * PER_PAGE, (p + 1) * PER_PAGE);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => go(p)}
                    aria-label={`Page ${p + 1} of ${pages}: ${shown.map((s) => s.name).join(" and ")}`}
                    aria-current={p === page || undefined}
                    className={`${pagerBtn} aria-[current]:bg-btn-bg aria-[current]:bg-[image:var(--chrome)] aria-[current]:text-btn-text`}
                  >
                    {String(p + 1).padStart(2, "0")}
                  </button>
                );
              })}
              <button type="button" onClick={() => go(page + 1)} aria-label="Next projects" className={pagerBtn}>
                →
              </button>
            </nav>
          )}
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            aria-expanded={all}
            className="inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
          >
            {all ? `show ${PER_PAGE} at a time` : `see all (${count})`}
          </button>
        </div>
      </Container>
    </section>
  );
}
