import About from "@/components/About";
import Banner from "@/components/Banner";
import BannerScroll from "@/components/BannerScroll";
import CardHighlights from "@/components/CardHighlights";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import PlaneLayer from "@/components/plane/PlaneLayer";
import Toolkit from "@/components/Toolkit";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <PlaneLayer />
      <main className="flex-1">
        <Hero />
        <Banner />
        <About />
        <Work />
        <Experience />
        <Toolkit />
        <Banner id="second-banner" decorative />
      </main>
      <Contact />
      <CardHighlights />
      <BannerScroll />
    </>
  );
}
