import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";

export const CARD_IDS = site.work.projects.map((p) => p.id);
// The Work pager hides cards (display: none); the flight only uses the ones on screen,
// in page order.
export const shownCards = () =>
  CARD_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => !!el && el.getClientRects().length > 0,
  );

// Document coordinates of a box.
export function docRect(el: Element | Range) {
  const r = el.getBoundingClientRect();
  const left = r.left + window.scrollX;
  const top = r.top + window.scrollY;
  return { left, top, right: left + r.width, bottom: top + r.height, height: r.height };
}

export const $ = (selector: string) => document.querySelector(selector);
export const navBottom = () => Math.max(0, $("header")?.getBoundingClientRect().bottom ?? 0);
export const maxScroll = () => ScrollTrigger.maxScroll(window);
