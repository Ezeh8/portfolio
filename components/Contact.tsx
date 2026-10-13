import { site } from "@/content/site";
import {
  ButtonLink,
  Container,
  HandArrow,
  HandNote,
  Headline,
  PanelBar,
  SectionLabel,
  StatusDot,
  hasHref,
} from "./ui";

export default function Contact() {
  const { label, headline, text, email, buttons, note, transmission, replies } = site.contact;
  const mailto =
    email &&
    `mailto:${email}?subject=${encodeURIComponent(transmission.subject)}&body=${encodeURIComponent(transmission.body)}`;

  return (
    <section id="contact" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <div className={`grid gap-12 ${email ? "lg:grid-cols-[1.2fr_1fr] lg:gap-14" : ""}`}>
          <div className="min-w-0">
            <SectionLabel>{label}</SectionLabel>
            <Headline copy={headline} className="mt-4 text-[clamp(2.75rem,8vw,6rem)]" />
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-text/75">{text}</p>

            {email && (
              <div className="mt-8">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a
                    href={`mailto:${email}`}
                    className="min-w-0 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] [overflow-wrap:anywhere] font-extrabold leading-tight tracking-tight underline decoration-2 underline-offset-[6px] hover:text-accent-text"
                  >
                    {email}
                  </a>
                  <HandArrow className="h-8 w-12 -scale-x-100 text-accent-text" />
                </p>
                <HandNote arrow="left" className="mt-2 rotate-2">
                  {note}
                </HandNote>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {buttons.filter(hasHref).map((button, i) => (
                <ButtonLink
                  key={button.label}
                  href={button.href}
                  variant={i === 0 ? "primary" : "secondary"}
                >
                  {button.label}
                </ButtonLink>
              ))}
            </div>

            <p className="mt-8 inline-flex items-center gap-2 rounded-full border-(length:--border-width) border-line bg-card px-3 py-1.5 font-mono text-xs">
              <StatusDot />
              {replies}
            </p>
          </div>

          {email && mailto && (
            <div className="panel self-start overflow-hidden">
              <PanelBar>
                <span className="flex items-center gap-2">
                  <StatusDot />
                  {transmission.header}
                </span>
              </PanelBar>
              <dl className="font-mono text-[13px]">
                <div className="flex gap-2 border-b-(length:--border-width) border-line/15 px-4 py-3">
                  <dt className="text-text-muted">to:</dt>
                  <dd className="min-w-0 [overflow-wrap:anywhere]">{email}</dd>
                </div>
                <div className="flex gap-2 border-b-(length:--border-width) border-line/15 px-4 py-3">
                  <dt className="text-text-muted">subject:</dt>
                  <dd>{transmission.subject}</dd>
                </div>
              </dl>
              <p className="px-4 pt-4 leading-relaxed text-text/80">{transmission.body}</p>
              <div className="p-4">
                <a
                  href={mailto}
                  className="inline-flex h-11 items-center rounded-full border-(length:--border-width) border-btn-bg bg-btn-bg px-5 font-mono text-sm text-btn-text hover:border-accent hover:bg-accent"
                >
                  {transmission.button}
                </a>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
