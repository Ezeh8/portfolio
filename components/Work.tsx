"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import ProjectCard from "./ProjectCard";
import { Container, Glyphs, HandNote, Headline, SectionLabel } from "./ui";

// How many project cards show before "See all".
const SHOWN = 2;

// A small tilt per card from 1024px up (the cards are full width, so it stays slight);
// flat below, so the phone flight is unaffected.
const tilts = ["lg:[--tilt:-0.3deg]", "lg:[--tilt:0.25deg]", "lg:[--tilt:0.2deg]", "lg:[--tilt:-0.3deg]"];

// The projects, stacked full-width cards: the first SHOWN, then "See all" shows every
// one. Hidden cards stay in the page with the `hidden` attribute, so their ids still
// exist.
export default function Work() {
  const { label, headline, note, seeAll, projects } = site.work;
  const [all, setAll] = useState(false);

  // the page length changes, so scroll-driven effects (the plane, reveals) re-measure
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [all]);

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

        <ul id="work-projects" className="mt-10 grid gap-8">
          {projects.map((project, i) => (
            <li
              key={project.id}
              hidden={!all && i >= SHOWN}
              className="motion-safe:animate-[card-in_350ms_ease-out]"
            >
              <ProjectCard project={project} number={i + 1} className={tilts[i % tilts.length]} />
            </li>
          ))}
        </ul>

        {projects.length > SHOWN && (
          <div className="mt-10 font-mono text-xs">
            <button
              type="button"
              onClick={() => setAll((v) => !v)}
              aria-expanded={all}
              aria-controls="work-projects"
              className="group inline-flex h-9 cursor-pointer items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
            >
              {all ? "show less" : <Glyphs text={seeAll} />}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
