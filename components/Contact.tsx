import { site } from "@/content/site";
import { ButtonLink, Container, Headline, StatusDot, hasHref } from "./ui";

// The closing block: the page's single footer, last on the page. The plane lands on the
// highlighted word of its headline. From 1024px: get-in-touch on the left (3/5),
// education on the right (2/5) behind a thin vertical line. Below 1024px the education
// block is hidden.
export default function Contact() {
  const { headline, text, email, buttons, replies } = site.contact;
  const title = <Headline copy={headline} className="text-[clamp(2.75rem,8vw,6rem)]" />;
  const { credentials, line, copyright } = site.footer;

  return (
    <footer id="contact" className="scroll-mt-16 pt-20 pb-6 sm:pt-28 sm:pb-8">
      <Container>
        <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div className="min-w-0">
            {email ? (
              <a href={`mailto:${email}`} className="block">
                {title}
              </a>
            ) : (
              title
            )}
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-text/75 sm:mt-6">{text}</p>

            <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
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

            <p className="mt-4 inline-flex items-center gap-2 rounded-full border-(length:--border-width) border-line bg-card px-3 py-1.5 font-mono text-xs sm:mt-6">
              <StatusDot />
              {replies}
            </p>
          </div>

          <div className="hidden border-l border-line pl-12 text-sm lg:block">
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              {credentials.label}
            </h3>
            <ul className="mt-3 space-y-1 leading-relaxed">
              {credentials.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 text-sm text-text-muted sm:mt-8">
          <p className="leading-relaxed">{line}</p>
          <p className="mt-2 font-mono text-xs sm:mt-3">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
