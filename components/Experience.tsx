"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { Container, Glyphs, Headline, SectionLabel } from "./ui";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches markers as whole words; a marker may be followed by a comma or full stop, but a
// number never matches inside a larger one ("4" never matches in "1,400", "4,000" or "4.5").
const markerPattern = new RegExp(
  `(?<![\\w,.₦])(${[...site.experience.markers]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|")})(?![\\w]|[,.]\\d)`,
);

// Every number inside a highlight is drawn in its own span (data-count) so CountUp can
// count it up; the text around the numbers keeps its own spans. Screen readers get the
// whole highlight once, from the sr-only copy.
function Marker({ text }: { text: string }) {
  // split() with one capture group puts the numbers at odd indexes
  const parts = text.split(/(\d[\d,]*\d|\d)/);
  if (parts.length === 1) return <Glyphs text={text} />;
  return (
    <>
      {parts.map((part, i) =>
        !part ? null : i % 2 === 1 ? (
          <span key={i} data-count={part.replace(/,/g, "")} aria-hidden="true">
            {part}
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            <Glyphs text={part} />
          </span>
        ),
      )}
      <span className="sr-only">{text}</span>
    </>
  );
}

function Marked({ text }: { text: string }) {
  return text.split(markerPattern).map((part, i) =>
    // split() with one capture group puts matches at odd indexes
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-marker bg-[image:var(--chrome-smooth)] px-1 text-marker-ink">
        <Marker text={part} />
      </mark>
    ) : (
      <Glyphs key={i} text={part} />
    ),
  );
}

// How many bullets a role card shows until it is clicked open.
const POINTS = 2;

type Role = (typeof site.experience.roles)[number];

// One role: a full-width two-column glass card. Left: the number, the company, the role,
// then the dates. Right: the first POINTS bullets with their highlights, then the ops log.
// Clicking anywhere on the card (its button's ::before stretches over it) shows every
// bullet; clicking again folds it back.
function RoleCard({ role, number }: { role: Role; number: number }) {
  const [open, setOpen] = useState(false);
  const more = role.bullets.length > POINTS;

  // the card's height changes, so scroll-driven effects (the plane) re-measure
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [open]);

  return (
    <article
      id={`role-${number}`}
      className={`panel relative z-[2] grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 ${more ? "cursor-pointer has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-accent-text" : ""}`}
    >
      <div>
        <p className="font-mono text-sm text-text-muted">{String(number).padStart(2, "0")} ~</p>
        <h3 className="mt-2 font-display text-2xl leading-tight font-extrabold text-btn-ink sm:text-[1.75rem]">
          {role.company}
        </h3>
        <p className="mt-2 text-sm leading-relaxed italic text-text-muted">{role.role}</p>
        <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-card-alt-title">{role.dates}</p>
      </div>

      <div>
        <ul
          id={`role-${number}-points`}
          className="list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-btn-shadow marker:text-accent-text"
        >
          {role.bullets.map((bullet, i) => (
            <li key={bullet} hidden={!open && i >= POINTS}>
              <Marked text={bullet} />
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
          <p>
            <Glyphs text={role.opsLog} />
          </p>
          {more && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`role-${number}-points`}
              className="group shrink-0 cursor-pointer uppercase outline-none before:absolute before:inset-0 before:z-[1] before:content-[''] hover:text-accent-text"
            >
              {open ? "show less" : <Glyphs text={`+${role.bullets.length - POINTS} more ↓`} />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// How many role cards show before "See all".
const SHOWN = 2;

// Mirrors the Work section: full-width two-column glass cards (RoleCard), stacked, with
// no cover or pop-up. The first SHOWN show; "See all" shows the rest in place (hidden
// cards stay in the page with the `hidden` attribute).
export default function Experience() {
  const { label, headline, roles } = site.experience;
  const [all, setAll] = useState(false);

  // the page length changes, so scroll-driven effects (the plane) re-measure
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [all]);

  return (
    <section id="experience" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline copy={headline} className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]" />

        <ol id="experience-roles" className="mt-10 grid gap-8">
          {roles.map((entry, i) => (
            <li key={entry.company} hidden={!all && i >= SHOWN}>
              <RoleCard role={entry} number={i + 1} />
            </li>
          ))}
        </ol>

        {roles.length > SHOWN && (
          <div className="mt-10 flex justify-end font-mono text-xs">
            <button
              type="button"
              onClick={() => setAll((v) => !v)}
              aria-expanded={all}
              aria-controls="experience-roles"
              className="group inline-flex h-9 cursor-pointer items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
            >
              {all ? "show less" : <Glyphs text={site.work.seeAll} />}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
