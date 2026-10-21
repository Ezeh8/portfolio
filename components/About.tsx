import { site } from "@/content/site";
import AboutStory from "./AboutStory";
import { Container, Headline, SectionLabel } from "./ui";

export default function About() {
  const { label, headline, headlineWide, paragraphs } = site.about;
  return (
    <section id="about" className="scroll-mt-16 py-12 sm:py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
          {/* a size container, so the wide headline can scale with the column's width */}
          <div className="@container">
            <SectionLabel>{label}</SectionLabel>
            {/* below md, sized so "I own the maps & specs" fits the width: two lines in all */}
            <Headline
              copy={headline}
              className="mt-4 whitespace-pre-line text-[min(2.25rem,calc((100vw-32px)/13.5))] sm:text-[min(2.25rem,calc((100vw-64px)/13.5))] md:hidden"
            />
            {/* from md, its three set lines, small enough that the longest fits the column */}
            <Headline
              copy={headlineWide}
              className="mt-4 hidden whitespace-pre-line md:block md:text-[min(clamp(2.25rem,5vw,3.5rem),calc(100cqw/7.4))]"
            />
          </div>
          <div className="space-y-8 text-[calc(clamp(1.25rem,2.2vw,1.625rem)-5px)] md:text-[calc(clamp(1.25rem,2.2vw,1.625rem)-7px)] leading-[1.6] text-text/75 md:pt-9">
            {/* phones show only the first paragraph; "the whole story" has the rest */}
            {paragraphs.map((p, i) => (
              <p key={p.slice(0, 24)} className={i > 0 ? "max-md:hidden" : undefined}>
                {p}
              </p>
            ))}
            <AboutStory />
          </div>
        </div>
      </Container>
    </section>
  );
}
