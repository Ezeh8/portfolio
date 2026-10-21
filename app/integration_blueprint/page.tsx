import type { Metadata } from "next";
import { site } from "@/content/site";
import SubPage from "@/components/SubPage";
import { ProtectedPages } from "@/components/PageViewer";
import { Container } from "@/components/ui";

const project = site.work.projects.find((p) => p.id === "energy-blueprint")!;

export const metadata: Metadata = {
  title: `${project.title} · ${site.name}`,
  description: project.subtitle,
  // shared by link (from the CV), not listed in search
  robots: { index: false, follow: false },
};

// The Integration Blueprint's view-only excerpt on a page of its own, for linking from the
// CV; the card's "View →" opens the same pages in an overlay.
export default function IntegrationBlueprintPage() {
  return (
    <SubPage page="/integration_blueprint" from="/#work">
      <section className="py-12 sm:py-16">
        <Container>
          <h1 className="chrome font-display text-[clamp(2rem,6vw,3rem)] font-extrabold leading-tight">
            {project.title}
          </h1>
          <p className="mt-2 font-display text-sm text-text-muted">{project.subtitle}</p>
          <ProtectedPages pages={"pages" in project && project.pages ? project.pages : []} />
        </Container>
      </section>
    </SubPage>
  );
}
