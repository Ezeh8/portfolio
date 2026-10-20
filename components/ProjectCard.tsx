import type { site } from "@/content/site";

type Project = (typeof site.work.projects)[number];

// A full-width project card in two columns (stacked on phones), everything on the card
// itself, with no overlay or cover, in the site's frosted-glass panel (.panel). Left: the
// number, the name, then the tagline. Right: what it does, then the stack as slim pills
// with a chrome "View →" link to the repo at the right of the same line. The card keeps
// the project's id, which the plane looks up.
export default function ProjectCard({ project, number }: { project: Project; number: number }) {
  return (
    <article
      id={project.id}
      className="panel relative z-[2] grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12"
    >
      {/* a container, so a one-line title can size itself to the column's width */}
      <div className="@container">
        <p className="font-mono text-sm leading-6 text-text-muted">{String(number).padStart(2, "0")} ~</p>
        <h3
          className={`mt-2 font-display leading-tight font-extrabold text-btn-ink ${
            "oneLine" in project && project.oneLine
              ? "whitespace-nowrap text-[min(1.5rem,calc(100cqw/12))] sm:text-[min(1.75rem,calc(100cqw/12))]"
              : "text-2xl sm:text-[1.75rem]"
          }`}
        >
          {project.title}
        </h3>
        {project.subtitle && <p className="mt-2 text-sm leading-relaxed italic text-text-muted">{project.subtitle}</p>}
      </div>

      <div className="flex flex-col">
        <p className="text-[15px] leading-6 text-btn-shadow">{project.description}</p>

        {/* the pills, with "View" on the same line at the right */}
        <div className="mt-5 flex items-center gap-4">
          {/* phones: one line, the pills scrolling sideways (fading at the right edge) when
              they don't all fit beside "View" */}
          <ul
            aria-label="Stack"
            className="flex min-w-0 flex-1 gap-2 max-md:overflow-x-auto max-md:[scrollbar-width:none] max-md:[mask-image:linear-gradient(to_right,black_80%,transparent)] md:flex-wrap max-md:[&::-webkit-scrollbar]:hidden"
          >
            {project.stack.map((item) => (
              <li
                key={item}
                className="shrink-0 whitespace-nowrap rounded-full border-(length:--border-width) border-line px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-card-alt-title"
              >
                {item}
              </li>
            ))}
          </ul>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="group shrink-0 whitespace-nowrap text-sm font-semibold"
            >
              {/* chrome on each part: the arrow is an inline-block (it nudges on hover), which
                  a parent's text-clipped background wouldn't reliably reach */}
              <span className="chrome">View</span>
              <span className="chrome ml-1 inline-block font-mono transition-transform duration-150 motion-safe:group-hover:translate-x-1">
                →
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
