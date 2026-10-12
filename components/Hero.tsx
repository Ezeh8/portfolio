import { site } from "@/content/site";
import { ButtonLink, Container } from "./ui";

export default function Hero() {
  const { label, name, tagline, headline, buttons } = site.hero;
  return (
    <section id="hero" className="scroll-mt-16 pt-16 pb-24 sm:pt-28 sm:pb-36">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-text/60">
          {label}
        </p>
        <p className="mt-8 font-display text-2xl font-semibold sm:text-3xl">{name}</p>
        <p className="mt-1 text-text/70">{tagline}</p>
        <h1 className="mt-8 max-w-[18ch] font-display text-[clamp(2.25rem,6.5vw,4.75rem)] font-semibold leading-[1.02] tracking-tight">
          {headline}
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          {buttons.map((button, i) => (
            <ButtonLink
              key={button.label}
              href={button.href}
              variant={i === 0 ? "primary" : "secondary"}
            >
              {button.label}
            </ButtonLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
