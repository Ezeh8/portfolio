"use client";

import { site } from "@/content/site";
import { Pager, usePager } from "./Pager";
import StoryCard from "./StoryCard";
import { Container, Glyphs, Headline, SectionLabel } from "./ui";

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
// numbered pager, swipe and "see all" as Work (see Pager). Each card follows the Work
// card pattern (StoryCard): a graph cover, the company, the role and the dates; clicking
// it opens the role's full story with every bullet and its highlights.
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
              <StoryCard
                id={`role-${i + 1}`}
                title={entry.company}
                subtitle={entry.role}
                topology={entry.topology}
                pills={[entry.dates]}
                pillsLabel="Dates"
                fitGroup="experience"
                className={tilts[i % tilts.length]}
              >
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                  <Glyphs text={entry.opsLog} />
                </p>
                <hr className="my-8 border-line" />
                <ul className="list-disc space-y-4 pl-5 text-lg leading-relaxed text-btn-ink marker:text-accent-text">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>
                      <Marked text={bullet} />
                    </li>
                  ))}
                </ul>
              </StoryCard>
            </li>
          ))}
        </ol>

        <Pager pager={pager} names={roles.map((r) => r.company)} noun="roles" />
      </Container>
    </section>
  );
}
