# ezehkena.com

The portfolio of Ezeh Ikenna ~ AI operations and agentic systems. Live at **[ezehkena.com](https://ezehkena.com)**.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- Tailwind CSS v4
- GSAP 3 (the scroll-driven paper plane) and Lenis (smooth scrolling)
- Fonts: Bricolage Grotesque and Kalam (Google Fonts via `next/font`), General Sans and Fragment Mono (local)

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) (your own machine, not the live site).

## Where things live

- `content/site.ts` ~ all the words: hero, projects, experience, toolkit, contact
- `app/` ~ pages (home, `/projects`, `/experience`, `/toolkit`), `globals.css` and the favicon
- `components/` ~ the sections and UI pieces
- `components/plane/` ~ the paper plane's flight (desktop and phone routes)
- `public/` ~ the CV (`ezeh_cv.pdf`)

## Deploy

Every push to `main` deploys to [ezehkena.com](https://ezehkena.com) on Netlify.
