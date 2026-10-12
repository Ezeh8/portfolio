import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Quote from "@/components/Quote";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Work />
        <Experience />
        <Quote />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
