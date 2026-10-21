import { site } from "@/content/site";
import { ButtonLink, Container, Headline, hasHref } from "./ui";

// Brand marks for the round social buttons, keyed by the link label (24×24 paths).
const socialIcons: Record<string, string> = {
  X: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  TikTok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.85 1.637-1.75 3.37-1.75 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  GitHub:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
};

// The closing block: the page's single footer, last on the page. The plane lands on the
// highlighted word of its headline. From 1024px: get-in-touch on the left (3/5),
// "Tell Me Everything" on the right (2/5) behind a thin vertical line, with round social buttons
// under it. Below 1024px the "Tell Me Everything" note is hidden and the social buttons sit under
// the get-in-touch block.
export default function Contact() {
  const { headline, email, buttons } = site.contact;
  const title = <Headline copy={headline} className="text-[clamp(2.75rem,8vw,6rem)]" />;
  const { credentials, socials, copyright } = site.footer;
  const socialLinks = socials.filter(hasHref);

  return (
    <footer id="contact" className="scroll-mt-16 pt-12 pb-6 sm:pt-16 sm:pb-8">
      <Container>
        {/* from 1024px two rows shared by both columns (subgrid): the headline and buttons
            beside the "Tell Me Everything" note, then the copyright level with the social
            buttons, so the two sides line up side by side. The left column is as wide as the
            headline, so the note gets the rest: room for its four lines at 15px. In the first
            row the buttons and the note's last line both sit on the row's bottom edge. */}
        <div className="lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-8 lg:gap-y-6">
          <div className="min-w-0 lg:row-span-2 lg:grid lg:grid-rows-subgrid">
            <div className="lg:flex lg:flex-col">
              {email ? (
                <a href={`mailto:${email}`} className="block">
                  {title}
                </a>
              ) : (
                title
              )}
              {/* phones: both on one line, slimmer, the text scaling with the width so they
                  always fit */}
              <div className="mt-6 flex gap-2 sm:flex-wrap sm:gap-4 lg:mt-auto lg:pt-6">
                {buttons.filter(hasHref).map((button) => (
                  <ButtonLink
                    key={button.label}
                    href={button.href}
                    variant="primary"
                    // the résumé opens in a new tab
                    newTab={button.href.endsWith(".pdf")}
                    className="max-sm:h-10 max-sm:px-3 max-sm:text-[min(14px,calc((100vw-88px)/20.5))]"
                  >
                    {button.label}
                  </ButtonLink>
                ))}
              </div>

            </div>

            {/* desktop: the copyright here, level with the social buttons */}
            <p className="hidden font-mono text-xs text-text-muted lg:block lg:self-center">{copyright}</p>
          </div>

          <div className="text-[1.0625rem] lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:border-l lg:border-line lg:pl-8">
            {/* nudged down so the heading's capitals start level with the tops of the big
                "get in touch." letters, which sit about 0.08em below the top of their line
                (Bricolage's ascent, less the 1.02 line height's leading and its ascender),
                less the ~3px above the heading's own capitals, plus 27px judged by eye */}
            <div className="hidden lg:flex lg:flex-col lg:pt-[calc(clamp(2.75rem,8vw,6rem)*0.08+24px)]">
              <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-white">
                {credentials.label}
              </h3>
              {/* 15px, four lines at most, its last line on the row's bottom edge */}
              <p className="mt-4 text-[15px] leading-[1.8] text-text-muted lg:mt-auto lg:pt-4">{credentials.text}</p>
            </div>

            {socialLinks.length > 0 && (
              <ul className="mt-6 flex gap-3 lg:mt-0 lg:self-center">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-(length:--border-width) border-btn-edge bg-btn-fill bg-[image:linear-gradient(180deg,#2a2d33,#111214)] text-btn-ink hover:bg-[image:var(--chrome-smooth)] shadow-[3px_3px_0_var(--btn-shadow)] transition-[translate,box-shadow,background-color,border-color,color] duration-150 ease-out hover:border-btn-hover hover:bg-btn-hover hover:text-btn-hover-ink hover:shadow-[5px_5px_0_var(--btn-hover-shadow)] motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 active:shadow-[1px_1px_0_var(--btn-shadow)] motion-safe:active:translate-x-0.5 motion-safe:active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
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

        <p className="mt-6 font-mono text-xs text-text-muted sm:mt-8 lg:hidden">{copyright}</p>
      </Container>
    </footer>
  );
}
