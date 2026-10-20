import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Kalam } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const kalam = Kalam({
  variable: "--font-hand",
  weight: "400",
  subsets: ["latin"],
});

// Full (unsubsetted) Fragment Mono from google/fonts, self-hosted so glyphs
// outside Google's latin subsets (e.g. →) render in the mono font.
const fragmentMono = localFont({
  variable: "--font-mono",
  src: [{ path: "./fonts/FragmentMono-Regular.ttf", weight: "400", style: "normal" }],
});

const generalSans = localFont({
  variable: "--font-body",
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Ezeh Ikenna",
  description:
    "I turn messy business operations into agentic systems that run on their own and report back clearly.",
};

// The site is dark only: dark browser UI and scrollbars, and the --bg color for the
// browser's theme color.
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0c0e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${bricolage.variable} ${fragmentMono.variable} ${kalam.variable} h-full antialiased`}
    >
      {/* The body is held at the window's height, with the page in a wrapper that
          overflows it. The plane rebuilds its flight when the body resizes, so cards
          opening (Experience "+2 more") no longer make it swoop to a new
          route; it still rebuilds when the window is resized. The sticky header's
          containing block is the wrapper, so it sticks for the whole page. */}
      <body className="h-full">
        <div aria-hidden="true" className="orb-layer">
          <div className="orb orb-right-top" />
          <div className="orb orb-left" />
          <div className="orb orb-right" />
        </div>
        {/* the page sits above the orbs; anything wider than the window (the plane passing
            an edge, a long line) is clipped, so the page never scrolls sideways and the
            header always spans the screen */}
        <div className="relative z-[1] flex min-h-full flex-col overflow-x-clip">{children}</div>
      </body>
    </html>
  );
}
