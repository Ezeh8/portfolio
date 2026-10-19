import type { Metadata } from "next";
import { site } from "@/content/site";
import SubPage from "@/components/SubPage";
import Work from "@/components/Work";

export const metadata: Metadata = {
  title: `Projects · ${site.name}`,
  description: "Every system I'm building, with the stack and the code on GitHub.",
};

// Every project card (the homepage shows the first two).
export default function Projects() {
  return (
    <SubPage page="/projects" from="/#work">
      <Work all />
    </SubPage>
  );
}
