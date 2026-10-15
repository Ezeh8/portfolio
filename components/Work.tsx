"use client";

import { site } from "@/content/site";
import { Pager, usePager } from "./Pager";
import ProjectCard from "./ProjectCard";
import { Container, HandNote, Headline, SectionLabel } from "./ui";

// A different small tilt per card from 1024px up; flat below, so the phone flight is unaffected.
const tilts = ["lg:[--tilt:-1deg]", "lg:[--tilt:0.75deg]", "lg:[--tilt:0.5deg]", "lg:[--tilt:-1deg]"];

export default function Work() {
  const { label, headline, note, projects } = site.work;
  // two cards per page with a numbered pager, swipe and "see all" (see Pager)
  const pager = usePager(projects.length);

  return (
    <section id="work" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <Headline copy={headline} className="text-[clamp(2.25rem,5vw,3.5rem)]" />
          <HandNote arrow="down" className="-rotate-2 self-start md:mb-2 md:self-auto">
            {note}
          </HandNote>
        </div>

        <ul
          className="mt-10 grid gap-12 md:grid-cols-2 md:gap-x-8 lg:gap-8"
          {...pager.swipe}
        >
          {projects.map((project, i) => (
            <li
              key={project.id}
              hidden={!pager.shows(i)}
              className="motion-safe:animate-[card-in_350ms_ease-out]"
            >
              <ProjectCard project={project} className={tilts[i % tilts.length]} />
            </li>
          ))}
        </ul>

        <Pager pager={pager} names={projects.map((p) => p.title)} noun="projects" />
      </Container>
    </section>
  );
}
