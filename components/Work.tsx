import { site } from "@/content/site";
import { SeeAllLink } from "./BackLink";
import ProjectCard from "./ProjectCard";
import { Container, Glyphs, Headline, SectionLabel } from "./ui";

// How many project cards the homepage shows; "See all" goes to /projects for the rest.
const HOME_PROJECTS = 2;

// The projects as stacked full-width cards. On the homepage (the default) only the first
// HOME_PROJECTS, then "See all →" to the projects page; `all` shows every one.
export default function Work({ all = false }: { all?: boolean }) {
  const { label, headline, seeAll, projects } = site.work;
  const shown = all ? projects : projects.slice(0, HOME_PROJECTS);

  return (
    <section id="work" className="scroll-mt-16 py-12 sm:py-16">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <Headline
          as={all ? "h1" : "h2"}
          copy={headline}
          className="mt-4 text-[calc(clamp(2.25rem,5vw,3.5rem)-3px)]"
        />

        <ul className="mt-10 grid gap-8">
          {shown.map((project, i) => (
            <li key={project.id}>
              <ProjectCard project={project} number={i + 1} />
            </li>
          ))}
        </ul>

        {!all && projects.length > HOME_PROJECTS && (
          <div className="mt-10 flex justify-end font-mono text-xs">
            <SeeAllLink
              href="/projects"
              className="group inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
            >
              <Glyphs text={seeAll} />
            </SeeAllLink>
          </div>
        )}
      </Container>
    </section>
  );
}
