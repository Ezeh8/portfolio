import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { $ } from "./dom";

// Smooth scrolling for mice and trackpads, driven from GSAP's ticker so ScrollTrigger and
// Lenis share one clock. In-page links scroll through Lenis and stop with the target's
// top just below the sticky nav.
export function startLenis() {
  const lenis = new Lenis({ lerp: 0.15 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link?.getAttribute("href")?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    // Lenis already subtracts the target's scroll-margin-top; add whatever the nav
    // covers beyond it.
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const nav = $("header")?.getBoundingClientRect().height ?? 0;
    lenis.scrollTo(target, { offset: -Math.max(0, nav - margin) });
    history.pushState(null, "", `#${id}`);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33); // GSAP's default
    lenis.destroy();
  };
}
