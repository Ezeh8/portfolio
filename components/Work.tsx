import Link from "next/link";
import { site } from "@/content/site";
import ProjectCard from "./ProjectCard";
import { Container, Glyphs, HandNote, Headline, SectionLabel } from "./ui";

// How many project cards the homepage shows; "See all" goes to /projects for the rest.
const HOME_PROJECTS = 2;

// The projects as stacked full-width cards. On the homepage (the default) only the first
// HOME_PROJECTS, then "See all →" to the projects page; `all` shows every one.
export default function Work({ all = false }: { all?: boolean }) {
  const { label, headline, note, seeAll, projects } = site.work;
  const shown = all ? projects : projects.slice(0, HOME_PROJECTS);

  return (
    <section id="work" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <Headline as={all ? "h1" : "h2"} copy={headline} className="text-[clamp(2.25rem,5vw,3.5rem)]" />
          <HandNote arrow="down" className="-rotate-2 self-start md:mb-2 md:self-auto">
            {note}
          </HandNote>
        </div>

        <ul className="mt-10 grid gap-8">
          {shown.map((project, i) => (
            <li key={project.id}>
              <ProjectCard project={project} number={i + 1} />
            </li>
          ))}
        </ul>

        {!all && projects.length > HOME_PROJECTS && (
          <div className="mt-10 flex justify-end font-mono text-xs">
            <Link
              href="/projects"
              className="group inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
            >
              <Glyphs text={seeAll} />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
