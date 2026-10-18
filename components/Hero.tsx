import { site } from "@/content/site";
import { RotatingWord } from "./RotatingWord";
import { ButtonLink, Container, HandNote, PanelBar, StatusDot } from "./ui";

export default function Hero() {
  const { label, name, tagline, status, prefix, words, headlineLabel, body, primary, secondary, flightLog, note } =
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
            <p className="chrome mt-6 font-display text-[33px] sm:text-[35px] font-medium lg:mt-3">{name}</p>
            <p className="mt-1 text-text/70">{tagline}</p>

            <p className="mt-8 inline-flex items-center gap-2 rounded-full lg:mt-5 border-(length:--border-width) border-line bg-card px-3 py-1.5 font-mono text-xs">
              <StatusDot />
              {status}
            </p>

            {/* one line: "i map the" then the rotating word, sized to fit the column */}
            <h1 className="mt-6 whitespace-nowrap font-display text-[calc(clamp(1.75rem,8vw,4.5rem)+5px)] font-extrabold leading-[1.02] tracking-[-0.03em] lowercase lg:mt-5 lg:text-[calc(clamp(3rem,5vw,3.5rem)+5px)]">
              <span className="sr-only">{headlineLabel}</span>
              <span aria-hidden="true" className="chrome">{prefix} </span>
              <RotatingWord words={[...words]} wordClassName="chrome" />
            </h1>
            <p className="mt-2 max-w-[34rem] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-text/75">
              {body}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              <ButtonLink href={secondary.href} download>
                {secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div>
            <HandNote className="relative z-[2] mb-3 ml-4 -rotate-3">{note}</HandNote>
            <div className="panel relative z-[2] overflow-hidden lg:[--tilt:1deg]">
              <PanelBar>
                <span className="flex items-center gap-2">
                  <StatusDot />
                  {flightLog.header}
                </span>
              </PanelBar>
              <div className="space-y-2 p-4 font-mono text-[13px] leading-relaxed sm:p-5">
                {/* the command and its answer on one line */}
                <p>
                  {flightLog.command}{" "}
                  <span className="text-accent-text">{flightLog.status(projects.length)}</span>
                </p>
                <ul className="space-y-2 pt-1">
                  {projects.map((p) => (
                    <li key={p.id}>
                      ✓ {p.title.toLowerCase()} · {p.deployedResult}
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
