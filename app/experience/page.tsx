import type { Metadata } from "next";
import { site } from "@/content/site";
import CountUp from "@/components/CountUp";
import Experience from "@/components/Experience";
import SubPage from "@/components/SubPage";

export const metadata: Metadata = {
  title: `Experience · ${site.name}`,
  description: "Every role so far, from fashion retail to banking to AI systems.",
};

// Every role card (the homepage shows the first two).
export default function ExperiencePage() {
  return (
    <SubPage page="/experience" from="/#experience">
      <Experience all />
      {/* the highlighted numbers count up here too */}
      <CountUp />
    </SubPage>
  );
}
