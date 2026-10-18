"use client";

import type { site } from "@/content/site";
import { Glyphs } from "./ui";
import { useFitLine } from "./useFitLine";

type Project = (typeof site.work.projects)[number];

// A project card, everything on the card itself (no overlay or cover): the numbered
// title, the subtitle, what it does, then the stack and a "Visit →" link to the repo.
// The card keeps the project's id, which the plane and the reveal effects look up.
export default function ProjectCard({
  project,
  number,
  className = "",
}: {
  project: Project;
  number: number;
  className?: string;
}) {
  // the title and subtitle stay on one line, sized alike across the Work cards
  const titleRef = useFitLine<HTMLHeadingElement>("work-title");
  const subtitleRef = useFitLine<HTMLParagraphElement>("work-subtitle");

  return (
    <article id={project.id} className={`panel relative z-[2] flex h-full flex-col overflow-hidden ${className}`}>
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <h3
          ref={titleRef}
          className="overflow-hidden font-display text-2xl font-extrabold whitespace-nowrap lowercase text-btn-ink sm:text-3xl"
        >
          {String(number).padStart(2, "0")} ~ {project.title}
        </h3>
        {project.subtitle && (
          <p
            ref={subtitleRef}
            className="mt-1 overflow-hidden font-display text-[13px] font-normal whitespace-nowrap italic text-text-muted"
          >
            {project.subtitle}
          </p>
        )}

        <p className="mt-4 flex-1 text-sm leading-relaxed text-btn-shadow">{project.description}</p>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-card-alt-title">
          <span className="text-text-muted">Stack:</span> {project.stack.join(" + ")}
          {project.github && (
            <>
              <span aria-hidden="true" className="mx-2 text-text-muted">
                |
              </span>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title} on GitHub`}
                className="group whitespace-nowrap text-btn-ink underline decoration-1 underline-offset-4 transition-[color,text-underline-offset] duration-150 hover:text-accent-text hover:underline-offset-[6px]"
              >
                <Glyphs text="Visit →" />
              </a>
            </>
          )}
        </p>
      </div>
    </article>
  );
}
