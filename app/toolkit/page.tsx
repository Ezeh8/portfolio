import type { Metadata } from "next";
import { site } from "@/content/site";
import SubPage from "@/components/SubPage";
import Toolkit from "@/components/Toolkit";

export const metadata: Metadata = {
  title: `Toolkit · ${site.name}`,
  description: "The tools behind the work: build, agents, evaluate and automate.",
};

// Every toolkit card (phones show the first two on the homepage).
export default function ToolkitPage() {
  return (
    <SubPage page="/toolkit" from="/#toolkit">
      <Toolkit all />
    </SubPage>
  );
}
