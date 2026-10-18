import { site } from "@/content/site";
import { ButtonLink, Container, Headline, StatusDot, hasHref } from "./ui";

// Brand marks for the round social buttons, keyed by the link label (24×24 paths).
const socialIcons: Record<string, string> = {
  X: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  TikTok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.85 1.637-1.75 3.37-1.75 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

// The closing block: the page's single footer, last on the page. The plane lands on the
// highlighted word of its headline. From 1024px: get-in-touch on the left (3/5),
// education on the right (2/5) behind a thin vertical line, with round social buttons
// under it. Below 1024px the education list is hidden and the social buttons sit under
// the get-in-touch block.
export default function Contact() {
  const { headline, paragraphs, email, buttons, replies } = site.contact;
  const title = <Headline copy={headline} className="text-[clamp(2.75rem,8vw,6rem)]" />;
  const { credentials, socials, copyright } = site.footer;
  const socialLinks = socials.filter(hasHref);

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
            <div className="mt-4 max-w-xl space-y-4 text-lg leading-relaxed text-text/75 sm:mt-6">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
              {buttons.filter(hasHref).map((button) => (
                <ButtonLink
                  key={button.label}
                  href={button.href}
                  variant="primary"
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

          {/* from 1024px the column runs the full height of the row, with the social buttons
              pinned to its bottom, so the list's length never moves them */}
          <div className="text-[1.0625rem] lg:flex lg:flex-col lg:border-l lg:border-line lg:pl-12">
            {/* nudged down so the heading's capitals start level with the tops of the big
                "get in touch." letters, which sit about 0.08em below the top of their line
                (Bricolage's ascent, less the 1.02 line height's leading and its ascender),
                less the ~3px above the heading's own capitals, plus 27px judged by eye */}
            <div className="hidden lg:block lg:mt-[calc(clamp(2.75rem,8vw,6rem)*0.08+24px)]">
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-white">
                {credentials.label}
              </h3>
              {/* the same line height and gap as the contact paragraphs on the left (18px text,
                  1.625 leading, 16px apart), so the lines keep one rhythm across */}
              <ul className="mt-4 space-y-4 text-sm leading-[calc(1.125rem*1.625)] text-text-muted">
                {credentials.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {socialLinks.length > 0 && (
              <ul className="mt-6 flex gap-3 lg:mt-auto lg:pt-8">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-(length:--border-width) border-btn-edge bg-btn-fill bg-[image:linear-gradient(180deg,#2a2d33,#111214)] text-btn-ink hover:bg-[image:var(--chrome)] shadow-[3px_3px_0_var(--btn-shadow)] transition-[translate,box-shadow,background-color,border-color,color] duration-150 ease-out hover:border-btn-hover hover:bg-btn-hover hover:text-btn-hover-ink hover:shadow-[5px_5px_0_var(--btn-hover-shadow)] motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 active:shadow-[1px_1px_0_var(--btn-shadow)] motion-safe:active:translate-x-0.5 motion-safe:active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                        <path d={socialIcons[link.label]} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-text-muted sm:mt-8">{copyright}</p>
      </Container>
    </footer>
  );
}
