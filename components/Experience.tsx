import { site } from "@/content/site";
import { Container, Glyphs, Headline, PanelBar, SectionLabel, StatusDot } from "./ui";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches the marker numbers only as whole numbers ("4" never matches inside "1,400").
const markerPattern = new RegExp(
  `(?<![\\w,.₦])(${[...site.experience.markers]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|")})(?![\\w,])`,
);

function Marked({ text }: { text: string }) {
  return text.split(markerPattern).map((part, i) =>
    // split() with one capture group puts matches at odd indexes
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-accent-soft px-1 text-text">
        <Glyphs text={part} />
      </mark>
    ) : (
      <Glyphs key={i} text={part} />
    ),
  );
}

export default function Experience() {
  const { label, headline, roles } = site.experience;
  return (
    <section id="experience" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline copy={headline} className="mt-4 text-[clamp(2.25rem,5.5vw,4rem)]" />

        <ol className="mt-10 space-y-8">
          {roles.map((entry) => (
            <li key={entry.company} className="panel overflow-hidden">
              <PanelBar>
                <span className="flex min-w-0 items-center gap-2">
                  <StatusDot />
                  <span>{entry.opsLog}</span>
                </span>
              </PanelBar>
              <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[1fr_2fr] md:gap-12">
                <div>
                  <h3 className="font-display text-2xl font-bold">{entry.role}</h3>
                  <p className="mt-1 text-text/75">{entry.company}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-text/60">
                    {entry.dates}
                  </p>
                </div>
                <ul className="list-disc space-y-3 pl-5 leading-relaxed marker:text-accent">
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
