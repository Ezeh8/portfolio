import { site } from "@/content/site";
import { Container, SectionLabel } from "./ui";

export default function About() {
  const { label, paragraphs } = site.about;
  return (
    <section id="about" className="scroll-mt-16 border-t border-text/10 py-20 sm:py-32">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <SectionLabel>{label}</SectionLabel>
          <div className="space-y-6 text-[clamp(1.125rem,2vw,1.375rem)] leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
