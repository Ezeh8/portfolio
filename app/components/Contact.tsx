import { site } from "@/content/site";
import { ButtonLink, Container, SectionLabel } from "./ui";

export default function Contact() {
  const { label, headline, text, buttons } = site.contact;
  return (
    <section id="contact" className="scroll-mt-16 border-t border-text/10 py-20 sm:py-32">
      <Container>
        <SectionLabel as="p">{label}</SectionLabel>
        <h2 className="mt-6 font-display text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-none tracking-tight">
          {headline}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text/75">{text}</p>
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
