import type { site } from "@/content/site";

type Project = (typeof site.work.projects)[number];

// A full-width project card in two columns (stacked on phones), everything on the card
// itself, with no overlay or cover, in the site's frosted-glass panel (.panel). Left: the
// number, the name, then the tagline. Right: what it does, then the stack as slim pills
// with a chrome "View →" link to the repo at the right of the same line. The card keeps
// the project's id, which the plane looks up.
export default function ProjectCard({ project, number }: { project: Project; number: number }) {
  return (
    // phones: one column held to the card's width (minmax(0, 1fr)), so a long row of pills
    // scrolls inside it rather than stretching the card past the screen
    <article
      id={project.id}
      className="panel relative z-[2] grid grid-cols-[minmax(0,1fr)] gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12"
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
          {/* one line at every size, the pills scrolling sideways (fading at the right edge)
              when they don't all fit beside "View"; slimmer pills from lg, so a full row of
              four usually fits there */}
          <ul
            aria-label="Stack"
            className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_80%,transparent)] lg:gap-1.5 lg:[mask-image:linear-gradient(to_right,black_92%,transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {project.stack.map((item) => (
              <li
                key={item}
                className="shrink-0 whitespace-nowrap rounded-full border-(length:--border-width) border-line px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-card-alt-title lg:px-2.5"
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
              aria-label={`View ${project.title}${project.github.includes("github.com") ? " on GitHub" : ""}`}
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
