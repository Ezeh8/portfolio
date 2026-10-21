import { site } from "@/content/site";
import { RotatingWord } from "./RotatingWord";
import { TypedLog } from "./TypedLog";
import { ButtonLink, Container, HandNote, PanelBar, StatusDot } from "./ui";

export default function Hero() {
  const { label, name, tagline, status, prefix, words, headlineLabel, body, primary, secondary, flightLog, note } =
    site.hero;

  return (
    <section id="hero" className="scroll-mt-16 pt-10 pb-10 sm:pt-14 sm:pb-14">
      <Container>
        {/* the flight log's column takes the card's width, so each of its lines fits on one line */}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 xl:gap-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              {label}
            </p>
            <p data-hero-name className="chrome mt-6 font-display text-[38px] sm:text-[40px] font-medium lg:mt-3">{name}</p>
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
              <ButtonLink href={secondary.href} newTab>
                {secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div>
            {/* desktop only: on phones the plane starts at the name instead */}
            <HandNote arrow="none" className="relative z-[2] mb-3 ml-4 -rotate-3 max-lg:hidden">
              {note}
            </HandNote>
            <div className="panel panel-classic panel-no-offset relative z-[2] overflow-hidden animate-none lg:[--tilt:-1deg]">
              <PanelBar>
                <span className="flex items-center gap-2">
                  {/* three dots, like a terminal window */}
                  <span className="flex gap-1.5">
                    <StatusDot />
                    <StatusDot />
                    <StatusDot />
                  </span>
                  {/* the name, then the rest of the title in grey */}
                  <span>
                    {flightLog.header.split(" - ")[0]}
                    <span className="text-text-muted">
                      {flightLog.header.slice(flightLog.header.indexOf(" - "))}
                    </span>
                  </span>
                </span>
              </PanelBar>
              {/* one line per entry everywhere; below lg the text scales with the width so the
                  longest line (56 characters) fits the card */}
              <div className="whitespace-nowrap px-2 py-4 font-mono text-[min(13px,calc((100vw-48px)/35))] leading-relaxed sm:px-5 lg:text-[12px]">
                <TypedLog lines={flightLog.lines} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
