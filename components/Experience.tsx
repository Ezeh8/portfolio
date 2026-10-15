"use client";

import { site } from "@/content/site";
import { Pager, usePager } from "./Pager";
import { Container, Glyphs, Headline, PanelBar, SectionLabel, StatusDot } from "./ui";

// Smaller tilts than Work, to keep the gaps between the cards even.
const tilts = ["lg:[--tilt:-0.5deg]", "lg:[--tilt:0.4deg]", "lg:[--tilt:-0.3deg]"];

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

// Two role cards per page, side by side from 768px (stacked on phones), with the same
// numbered pager, swipe and "see all" as Work (see Pager). Each card shows only its first
// BULLETS bullets, to keep the cards close to the Work cards' size; reorder a role's
// bullets in content/site.ts to choose which ones show.
const BULLETS = 2;

export default function Experience() {
  const { label, headline, roles } = site.experience;
  const pager = usePager(roles.length);
  return (
    <section id="experience" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline copy={headline} className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]" />

        <ol className="mt-10 grid gap-8 md:grid-cols-2" {...pager.swipe}>
          {roles.map((entry, i) => (
            <li
              key={entry.company}
              hidden={!pager.shows(i)}
              className="motion-safe:animate-[card-in_350ms_ease-out]"
            >
              <article className={`panel relative z-[2] h-full overflow-hidden ${tilts[i % tilts.length]}`}>
                <PanelBar>
                  <span className="flex min-w-0 items-center gap-2">
                    <StatusDot />
                    <span>{entry.opsLog}</span>
                  </span>
                </PanelBar>
                <div className="grid gap-5 p-5 sm:p-7">
                  <div>
                    <h3 className="font-display text-2xl font-bold">{entry.role}</h3>
                    <p className="mt-1 text-text/75">{entry.company}</p>
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                      {entry.dates}
                    </p>
                  </div>
                  <ul className="list-disc space-y-3 text-[1.0625rem] pl-5 leading-relaxed marker:text-accent-text">
                    {entry.bullets.slice(0, BULLETS).map((bullet) => (
                      <li key={bullet}>
                        <Marked text={bullet} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <Pager pager={pager} names={roles.map((r) => r.company)} noun="roles" />
      </Container>
    </section>
  );
}
