import { site } from "@/content/site";
import { Container } from "./ui";

export default function Quote() {
  return (
    <section id="quote" aria-label="Quote" className="scroll-mt-16 py-24 sm:py-36">
      <Container>
        <blockquote className="mx-auto max-w-[22ch] text-center font-display text-[clamp(2rem,5.5vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
          <p>{site.quote.text}</p>
        </blockquote>
      </Container>
    </section>
  );
}
