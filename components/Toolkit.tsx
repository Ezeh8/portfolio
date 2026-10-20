import { site } from "@/content/site";
import { SeeAllLink } from "./BackLink";
import { Container, Glyphs, Headline, SectionLabel } from "./ui";

// The skill cards keep the original solid card (.panel-classic), not the glass: a small
// tilt per card from md up (flat on phones), the float and the hover lift. On phones
// (below sm) the homepage shows only the first SHOWN cards, with "See all →" under them
// to the toolkit page; `all` shows every one.
const tilts = ["md:[--tilt:-1.5deg]", "md:[--tilt:1deg]", "md:[--tilt:-0.75deg]", "md:[--tilt:1.75deg]"];

const SHOWN = 2;

export default function Toolkit({ all = false }: { all?: boolean }) {
  const { label, headline, groups } = site.toolkit;
  return (
    <section id="toolkit" className="scroll-mt-16 py-12 sm:py-16">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        {/* below md, sized so the headline fits on one line */}
        <Headline
          as={all ? "h1" : "h2"}
          copy={headline}
          className="mt-4 whitespace-nowrap text-[min(34px,calc((100vw-32px)/11.7))] sm:text-[34px] md:whitespace-normal md:text-[clamp(2.25rem,5vw,3.5rem)]"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group, i) => (
            <li
              key={group.title}
              className={`panel panel-classic relative z-[2] p-5 ${tilts[i % tilts.length]} ${i >= SHOWN && !all ? "max-sm:hidden" : ""}`}
            >
              <h3
                className={`flex items-center justify-between border-b-(length:--border-width) border-dashed border-line/40 pb-3 font-mono text-xs uppercase tracking-[0.12em]`}
              >
                {group.title}
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border-(length:--border-width) border-line bg-bg"
                />
              </h3>
              <ul className="mt-4 space-y-2 text-[1.0625rem]">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* phones: the same "See all →" button as Work and Experience, to the toolkit page */}
        {!all && groups.length > SHOWN && (
          <div className="mt-10 flex justify-end font-mono text-xs sm:hidden">
            <SeeAllLink
              href="/toolkit"
              className="group inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome-smooth)] hover:text-btn-text motion-safe:active:scale-95"
            >
              <Glyphs text={site.work.seeAll} />
            </SeeAllLink>
          </div>
        )}
      </Container>
    </section>
  );
}
