"use client";

import { SeeAllLink } from "./BackLink";
import { useState } from "react";
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

// How many bullets a role card shows until it is clicked open: one on phones, two from
// md up.
const POINTS = 1;
const POINTS_MD = 2;

type Role = (typeof site.experience.roles)[number];

// One role: a full-width two-column glass card. Left: the number, the company, the role,
// then the dates. Right: the first POINTS (from md, POINTS_MD) bullets with their
// highlights, then the ops log.
// Clicking anywhere on the card (its button's ::before stretches over it) shows every
// bullet; clicking again folds it back. Opening a card deliberately
// doesn't re-measure the plane's flight, so the plane doesn't swoop to a new route
// mid-scroll (see the page wrapper in app/layout.tsx).
function RoleCard({ role, number }: { role: Role; number: number }) {
  const [open, setOpen] = useState(false);
  const more = role.bullets.length > POINTS;

  return (
    <article
      id={`role-${number}`}
      className={`panel relative z-[2] grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 ${more ? "cursor-pointer has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-accent-text" : ""}`}
    >
      <div className="flex flex-col">
        <p className="font-mono text-sm leading-6 text-text-muted">{String(number).padStart(2, "0")} ~</p>
        <h3 className="mt-2 font-display text-2xl leading-tight font-extrabold text-btn-ink sm:text-[1.75rem]">
          {/* a "(…)" note after the name goes on its own line under it, smaller; on phones
              kept whole and sized to fit */}
          {role.company.includes(" (") ? (
            <>
              {role.company.slice(0, role.company.indexOf(" ("))}{" "}
              <span className="mt-1 block text-[min(1.125rem,calc((100vw-80px)/18))] max-md:whitespace-nowrap md:text-xl">
                {role.company.slice(role.company.indexOf(" (") + 1)}
              </span>
            </>
          ) : (
            role.company
          )}
        </h3>
        <p className="mt-2 text-sm leading-relaxed italic text-text-muted">{role.role}</p>
        {/* from md, the dates sit at the card's base, level with the ops log */}
        <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-card-alt-title md:mt-auto md:pt-3">{role.dates}</p>
      </div>

      <div className="flex flex-col">
        <ul
          id={`role-${number}-points`}
          // from md the bullet dots hang in the gap, so the text lines up with the Work cards' text
          className="list-disc space-y-3 pl-5 text-[15px] leading-6 text-btn-shadow marker:text-accent-text md:-ml-5"
        >
          {role.bullets.map((bullet, i) => (
            <li
              key={bullet}
              className={open || i < POINTS ? undefined : i < POINTS_MD ? "max-md:hidden" : "hidden"}
            >
              <Marked text={bullet} />
            </li>
          ))}
        </ul>
        {/* the ops log and "+N more" on one line, from md pinned to the card's base (level
            with the dates); on phones the text tightens and scales
            with the width (the longest pair is 43 characters) so they always fit */}
        <div className="mt-5 flex items-center justify-between gap-4 whitespace-nowrap font-mono md:mt-auto md:pt-5 text-[11px] uppercase tracking-[0.12em] text-text-muted max-sm:gap-3 max-sm:text-[min(11px,calc((100vw-92px)/28.5))] max-sm:tracking-[0.04em]">
          <p>
            <Glyphs text={role.opsLog} />
          </p>
          {more && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`role-${number}-points`}
              // from md, no button when the first POINTS_MD bullets are all of them
              className={`group shrink-0 cursor-pointer uppercase outline-none before:absolute before:inset-0 before:z-[1] before:content-[''] hover:text-accent-text ${role.bullets.length <= POINTS_MD ? "md:hidden" : ""}`}
            >
              {open ? (
                "show less"
              ) : (
                <>
                  <span className="md:hidden">
                    <Glyphs text={`+${role.bullets.length - POINTS} more ↓`} />
                  </span>
                  <span className="max-md:hidden">
                    <Glyphs text={`+${role.bullets.length - POINTS_MD} more ↓`} />
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// How many role cards the homepage shows; "See all" goes to /experience for the rest.
const HOME_ROLES = 2;

// Mirrors the Work section: full-width two-column glass cards (RoleCard), stacked, with
// no cover or pop-up. On the homepage (the default) only the first HOME_ROLES, then
// "See all →" to the experience page; `all` shows every one.
export default function Experience({ all = false }: { all?: boolean }) {
  const { label, headline, roles } = site.experience;
  const shown = all ? roles : roles.slice(0, HOME_ROLES);

  return (
    <section id="experience" className="scroll-mt-16 py-12 sm:py-16">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline as={all ? "h1" : "h2"} copy={headline} className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]" />

        <ol className="mt-10 grid gap-8">
          {shown.map((entry, i) => (
            <li key={entry.company}>
              <RoleCard role={entry} number={i + 1} />
            </li>
          ))}
        </ol>

        {!all && roles.length > HOME_ROLES && (
          <div className="mt-10 flex justify-end font-mono text-xs">
            <SeeAllLink
              href="/experience"
              className="group inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
            >
              <Glyphs text={site.work.seeAll} />
            </SeeAllLink>
          </div>
        )}
      </Container>
    </section>
  );
}
