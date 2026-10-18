import { site } from "@/content/site";
import AboutStory from "./AboutStory";
import { Container, Headline, SectionLabel } from "./ui";

export default function About() {
  const { label, headline, paragraphs } = site.about;
  return (
    <section id="about" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <SectionLabel>{label}</SectionLabel>
            <Headline copy={headline} className="mt-4 whitespace-pre-line text-[clamp(2.25rem,5vw,3.5rem)]" />
          </div>
          <div className="space-y-8 text-[calc(clamp(1.25rem,2.2vw,1.625rem)-5px)] leading-[1.6] text-text/75 md:pt-9">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <AboutStory />
          </div>
        </div>
      </Container>
    </section>
  );
}
