import { site } from "@/content/site";
import { Container, Glyphs, Headline, PanelBar, SectionLabel, StatusDot } from "./ui";

// Smaller tilts than Work: these cards are full width, so a bigger angle would squeeze the gaps between them.
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

// A marker split into an optional "₦", the number, and the rest ("%", "M+", "+").
const markerParts = /^(₦?)([\d,]+)(.*)$/;

// The number is drawn in its own span (data-count) so CountUp can count it up; screen
// readers get the whole marker once, from the sr-only copy.
function Marker({ text }: { text: string }) {
  const parts = text.match(markerParts);
  if (!parts) return <Glyphs text={text} />;
  const [, prefix, number, suffix] = parts;
  return (
    <>
      {prefix && (
        <span aria-hidden="true">
          <Glyphs text={prefix} />
        </span>
      )}
      <span data-count={number.replace(/,/g, "")} aria-hidden="true">
        {number}
      </span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
      <span className="sr-only">{text}</span>
    </>
  );
}

function Marked({ text }: { text: string }) {
  return text.split(markerPattern).map((part, i) =>
    // split() with one capture group puts matches at odd indexes
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-marker px-1 text-marker-ink">
        <Marker text={part} />
      </mark>
    ) : (
      <Glyphs key={i} text={part} />
    ),
  );
}

// Tinted cards: the Evaluate toolkit card's grey, with muted labels in its title grey.
const tint = "bg-card-alt [--text-muted:var(--card-alt-title)]";

export default function Experience() {
  const { label, headline, roles } = site.experience;
  return (
    <section id="experience" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline copy={headline} className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]" />

        <ol className="mt-10 space-y-8">
          {roles.map((entry, i) => (
            <li
              key={entry.company}
              className={`panel relative z-[2] overflow-hidden ${tilts[i % tilts.length]}${entry.tinted ? ` ${tint}` : ""}`}
            >
              <PanelBar className={entry.tinted ? "text-card-alt-title" : ""}>
                <span className="flex min-w-0 items-center gap-2">
                  <StatusDot />
                  <span>{entry.opsLog}</span>
                </span>
              </PanelBar>
              <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[1fr_2fr] md:gap-12">
                <div>
                  <h3 className="font-display text-2xl font-bold">{entry.role}</h3>
                  <p className="mt-1 text-text/75">{entry.company}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                    {entry.dates}
                  </p>
                </div>
                <ul className="list-disc space-y-3 text-[1.0625rem] pl-5 leading-relaxed marker:text-accent-text">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>
                      <Marked text={bullet} />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
