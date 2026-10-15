import { site } from "@/content/site";
import { RotatingWord } from "./RotatingWord";
import { Container } from "./ui";

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-16 lg:items-start">
          {/* left: label + rotating word */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="sr-only">{site.about.label}</span>
            <span
              aria-hidden="true"
              className="font-medium lowercase tracking-tight"
              style={{ fontSize: "20px", color: "#4a4f5a" }}
            >
              {site.about.prefix}
            </span>
            <RotatingWord
              words={[...site.about.words]}
              className="font-extrabold leading-none tracking-[-0.03em] lowercase"
              style={{ fontSize: "35px" }}
            />
          </div>
          {/* right: body copy */}
          <p
            className="leading-[1.7] max-w-prose lg:pt-1"
            style={{ fontSize: "1rem", color: "#6b6f78" }}
          >
            {site.about.body}
          </p>
        </div>
      </Container>
    </section>
  );
}
