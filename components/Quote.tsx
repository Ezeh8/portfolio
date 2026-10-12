import { site } from "@/content/site";
import { Container } from "./ui";

export default function Quote() {
  return (
    <section
      id="quote"
      aria-label="Quote"
      className="scroll-mt-16 border-t border-text/10 py-24 sm:py-40"
    >
      <Container>
        <blockquote className="mx-auto max-w-[24ch] text-center font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.08] tracking-tight">
          <p>{site.quote.text}</p>
        </blockquote>
      </Container>
    </section>
  );
}
