import { site } from "@/content/site";
import { Container, SectionLabel } from "./ui";

export default function Experience() {
  const { label, roles } = site.experience;
  return (
    <section id="experience" className="scroll-mt-16 border-t border-text/10 py-20 sm:py-32">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <ol className="mt-10">
          {roles.map((entry) => (
            <li
              key={entry.company}
              className="grid gap-4 border-t border-text/10 py-10 first:border-t-0 first:pt-0 md:grid-cols-[1fr_2fr] md:gap-16"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold">{entry.role}</h3>
                <p className="mt-1 text-text/75">{entry.company}</p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-text/60">
                  {entry.dates}
                </p>
              </div>
              <ul className="list-disc space-y-3 pl-5 leading-relaxed marker:text-accent">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
