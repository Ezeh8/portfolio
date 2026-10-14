import gsap from "gsap";
import type { Key, Size } from "./PlaneFlight";

// Development-only overlay (?plane=debug): a live readout of the plane's state and the
// whole flight path drawn on screen. Plain DOM, outside React; it only reads the flight.

type Flight = {
  keys: Key[];
  size: Size;
  /** The phone (under 1024px) choreography is running. */
  phone?: boolean;
  tl: gsap.core.Timeline;
  proxy: { x: number; y: number; scale: number; tilt: number; facing: number; bow: number };
};

const SVG = "http://www.w3.org/2000/svg";

export function attachPlaneDebug({ keys, size, phone = false, tl, proxy }: Flight) {
  const { vw, vh } = size;
  const px = (x: number) => (x / 100) * vw;
  const py = (y: number) => (y / 100) * vh;

  // Path: each leg sampled along its own eases, dashed, with a numbered dot per keyframe.
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("aria-hidden", "true");
  Object.assign(svg.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "60",
    overflow: "visible",
  });
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    const ex = gsap.parseEase(b.xEase ?? "sine.inOut");
    const ey = gsap.parseEase(b.yEase ?? "sine.inOut");
    const points = Array.from({ length: 25 }, (_, k) => {
      const u = k / 24;
      const y = a.y + (b.y - a.y) * ey(u) + (b.sag ?? 0) * Math.sin(Math.PI * u);
      return `${px(a.x + (b.x - a.x) * ex(u)).toFixed(1)},${py(y).toFixed(1)}`;
    });
    const line = document.createElementNS(SVG, "polyline");
    line.setAttribute("points", points.join(" "));
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "var(--text)");
    line.setAttribute("stroke-opacity", "0.35");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-dasharray", "4 4");
    svg.appendChild(line);
  }
  keys.forEach((k, i) => {
    const dot = document.createElementNS(SVG, "circle");
    dot.setAttribute("cx", px(k.x).toFixed(1));
    dot.setAttribute("cy", py(k.y).toFixed(1));
    dot.setAttribute("r", "3");
    dot.setAttribute("fill", "var(--accent-text)");
    const label = document.createElementNS(SVG, "text");
    label.setAttribute("x", (px(k.x) + 6).toFixed(1));
    label.setAttribute("y", (py(k.y) - 6).toFixed(1));
    label.setAttribute("font-size", "11");
    label.setAttribute("font-family", "var(--font-mono), monospace");
    label.setAttribute("fill", "var(--text)");
    label.textContent = String(i);
    svg.append(dot, label);
  });

  // Live readout, bottom-left.
  const panel = document.createElement("pre");
  Object.assign(panel.style, {
    position: "fixed",
    left: "8px",
    bottom: "8px",
    zIndex: "61",
    margin: "0",
    padding: "8px 10px",
    font: "11px/1.5 var(--font-mono), monospace",
    color: "var(--text)",
    background: "color-mix(in srgb, var(--card) 92%, transparent)",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    pointerEvents: "none",
  });

  document.body.append(svg, panel);

  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id], footer[id]"));
  const update = () => {
    const middle = window.innerHeight / 2;
    const section =
      sections.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= middle && r.bottom > middle;
      })?.id ?? "—";
    const t = tl.time();
    let leg = 1;
    while (leg < keys.length - 1 && t >= keys[leg].s) leg++;
    const rotation = (proxy.facing < 0 ? -1 : 1) * proxy.tilt;
    panel.textContent = [
      `flight   ${phone ? "phone (under 1024px)" : "desktop"}`,
      `section  ${section}`,
      `leg ${leg} / ${keys.length - 1}  ${keys[leg].name}`,
      `x ${proxy.x.toFixed(1)}  y ${(proxy.y + proxy.bow).toFixed(1)}  scale ${proxy.scale.toFixed(2)}`,
      `rotation ${rotation.toFixed(1)}°  facing ${proxy.facing < 0 ? "left" : "right"}` +
        (Math.abs(proxy.facing) < 1 ? `  (banking ${proxy.facing.toFixed(2)})` : ""),
    ].join("\n");
  };
  gsap.ticker.add(update);
  update();

  return () => {
    gsap.ticker.remove(update);
    svg.remove();
    panel.remove();
  };
}
