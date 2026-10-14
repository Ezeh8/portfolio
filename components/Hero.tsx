import { site } from "@/content/site";
import { ButtonLink, Container, HandNote, Headline, PanelBar, StatusDot } from "./ui";

export default function Hero() {
  const { label, name, tagline, status, headline, intro, primary, secondary, flightLog, note } =
    site.hero;
  const { projects } = site.work;

  return (
    <section id="hero" className="scroll-mt-16 pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              {label}
            </p>
            <p className="mt-6 font-display text-2xl font-medium lg:mt-3">{name}</p>
            <p className="mt-1 text-text/70">{tagline}</p>

            <p className="mt-8 inline-flex items-center gap-2 rounded-full lg:mt-5 border-(length:--border-width) border-line bg-card px-3 py-1.5 font-mono text-xs">
              <StatusDot />
              {status}
            </p>

            <Headline
              as="h1"
              copy={headline}
              className="mt-6 whitespace-nowrap text-[clamp(1.75rem,8.8vw,4.5rem)] lg:mt-5 lg:text-[clamp(3rem,5vw,3.5rem)]"
            />
            <p className="mt-6 max-w-[34rem] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-text/75">
              {intro}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              <a
                href={secondary.href}
                className="text-sm font-medium underline decoration-2 underline-offset-4 transition-[color,text-underline-offset] duration-150 hover:text-accent-text hover:underline-offset-[7px]"
              >
                {secondary.label}
              </a>
            </div>
          </div>

          <div>
            <HandNote className="relative z-[2] mb-3 ml-4 -rotate-3">{note}</HandNote>
            <div className="panel relative z-[2] overflow-hidden">
              <PanelBar>
                <span className="flex items-center gap-2">
                  <StatusDot />
                  {flightLog.header}
                </span>
              </PanelBar>
              <div className="space-y-2 p-4 font-mono text-[13px] leading-relaxed sm:p-5">
                <p>{flightLog.command}</p>
                <p className="text-accent-text">{flightLog.status(projects.length)}</p>
                <ul className="space-y-2 pt-1">
                  {projects.map((p) => (
                    <li key={p.id}>
                      ✓ {p.name.toLowerCase()} · {p.readout}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
