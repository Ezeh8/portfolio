"use client";

import { site } from "@/content/site";
import { Pager, usePager } from "./Pager";
import {
  Container,
  Glyphs,
  HandNote,
  Headline,
  PanelBar,
  SectionLabel,
  StatusDot,
  isExternal,
} from "./ui";

// A different small tilt per card from 1024px up; flat below, so the phone flight is unaffected.
const tilts = ["lg:[--tilt:-1deg]", "lg:[--tilt:0.75deg]", "lg:[--tilt:0.5deg]", "lg:[--tilt:-1deg]"];

export default function Work() {
  const { label, headline, note, panelStatus, linkLabel, projects } = site.work;
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
              <article
                id={project.id}
                className={`panel relative z-[2] flex h-full flex-col overflow-hidden ${tilts[i % tilts.length]}`}
              >
                <PanelBar>
                  <span className="flex items-center gap-2">
                    <StatusDot />
                    {panelStatus}
                  </span>
                  <span className="text-text-muted">scan-{String(i + 1).padStart(2, "0")}</span>
                </PanelBar>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">{project.name}</h3>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-text/75">{project.description}</p>

                  {project.chips.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                      {project.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full border-(length:--border-width) border-line px-2.5 py-0.5 font-mono text-xs"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-8">
                    {/* dashed until the card reaches mid-screen; CardHighlights sets data-lit */}
                    <p
                      data-readout
                      className="border-t-(length:--border-width) border-dashed border-accent-text pt-3 font-mono text-sm text-accent-text transition-colors duration-300 data-[lit]:border-solid data-[lit]:bg-accent-soft data-[lit]:text-text"
                    >
                      {project.readout}
                    </p>
                    {project.href && (
                      <a
                        href={project.href}
                        {...(isExternal(project.href) && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                        className="mt-4 inline-block text-sm font-medium underline decoration-2 underline-offset-4 transition-[color,text-underline-offset] duration-150 hover:text-accent-text hover:underline-offset-[7px]"
                      >
                        <Glyphs text={linkLabel} />
                        <span className="sr-only">: {project.name}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <Pager pager={pager} names={projects.map((p) => p.name)} noun="projects" />
      </Container>
    </section>
  );
}
