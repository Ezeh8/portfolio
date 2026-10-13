import About from "@/components/About";
import Banner from "@/components/Banner";
import CardHighlights from "@/components/CardHighlights";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import PlaneLayer from "@/components/plane/PlaneLayer";
import Quote from "@/components/Quote";
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
        <Quote />
        <Contact />
      </main>
      <Footer />
      <CardHighlights />
    </>
  );
}
