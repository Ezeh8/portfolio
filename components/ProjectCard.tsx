import type { site } from "@/content/site";
import StoryCard, { Pills, StoryLabel } from "./StoryCard";
import { Glyphs } from "./ui";

type Project = (typeof site.work.projects)[number];

// A project card: the shared StoryCard with the title, subtitle and the tools used (the
// stack). Its overlay tells the full story: what it is, where it is deployed, and what
// it is teaching me.
export default function ProjectCard({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <StoryCard
      id={project.id}
      title={project.title}
      subtitle={project.subtitle}
      topology={project.topology}
      pills={project.stack}
      pillsLabel="Tools used"
      fitGroup="work"
      className={className}
    >
      <p className="mt-6 text-lg leading-relaxed text-btn-ink sm:text-xl">{project.oneLiner}</p>

      <hr className="my-8 border-line" />

      <StoryLabel>Deployed at</StoryLabel>
      <p className="mt-2 text-btn-ink">{project.deployedAt}</p>
      <p className="mt-2 text-sm text-accent-text">
        <Glyphs text={project.deployedResult} />
      </p>

      <hr className="my-8 border-line" />

      <StoryLabel>what this is teaching me</StoryLabel>
      <p className="mt-3 font-display text-xl font-semibold text-btn-ink">{project.teaching}</p>
      <div className="mt-5 flex flex-col gap-4 leading-relaxed text-btn-shadow">
        {project.teachingStory.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <hr className="my-8 border-line" />

      <Pills items={project.stack} label="Tools used" />
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-block text-sm font-medium underline decoration-2 underline-offset-4 transition-[color,text-underline-offset] duration-150 hover:text-accent-text hover:underline-offset-[7px]"
        >
          <Glyphs text="View on GitHub →" />
        </a>
      )}
    </StoryCard>
  );
}
