import { site } from "@/content/site";
import { Container, SectionLabel, isExternal } from "./ui";

export default function Work() {
  const { label, linkLabel, projects } = site.work;
  return (
    <section id="work" className="scroll-mt-16 border-t border-text/10 py-20 sm:py-32">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
          {projects.map((project) => (
            <li key={project.id}>
              <article
                id={project.id}
                className="flex h-full flex-col rounded-2xl border border-text/10 bg-white/40 p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl font-semibold sm:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-text/75">
                  {project.description}
                </p>
                <p className="mt-8 border-t border-accent pt-3 font-mono text-sm text-accent-text">
                  {project.readout}
                </p>
                <a
                  href={project.href}
                  {...(isExternal(project.href) && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="mt-6 self-start text-sm font-medium underline decoration-text/30 underline-offset-4 hover:decoration-text"
                >
                  {linkLabel}
                  <span className="sr-only">: {project.name}</span>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
