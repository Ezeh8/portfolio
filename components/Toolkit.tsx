import { site } from "@/content/site";
import { Container, Headline, SectionLabel } from "./ui";

// A different small tilt per card from md up; flat on phones.
const tilts = ["md:[--tilt:-1.5deg]", "md:[--tilt:1deg]", "md:[--tilt:-0.75deg]", "md:[--tilt:1.75deg]"];

export default function Toolkit() {
  const { label, headline, groups } = site.toolkit;
  return (
    <section id="toolkit" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline copy={headline} className="mt-4 text-[clamp(2.25rem,5.5vw,4rem)]" />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group, i) => (
            <li key={group.title} className={`panel relative z-[2] p-5 ${tilts[i % tilts.length]}`}>
              <h3 className="flex items-center justify-between border-b-(length:--border-width) border-dashed border-line/40 pb-3 font-mono text-xs uppercase tracking-[0.12em]">
                {group.title}
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border-(length:--border-width) border-line bg-bg"
                />
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
