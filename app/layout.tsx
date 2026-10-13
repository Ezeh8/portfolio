import type { Metadata } from "next";
import { Bricolage_Grotesque, Kalam } from "next/font/google";
import localFont from "next/font/local";
import { themeScript } from "@/components/theme";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by the head script before React hydrates
    <html
      lang="en"
      suppressHydrationWarning
      className={`${generalSans.variable} ${bricolage.variable} ${fragmentMono.variable} ${kalam.variable} h-full antialiased`}
    >
      <head>
        {/* sets data-theme before the first paint, so the page never flashes the wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
