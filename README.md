# Arnold Ihechere, product manager and designer

Personal portfolio. React 19, TypeScript, Vite, Tailwind v4, GSAP (ScrollTrigger, SplitText, MotionPath) and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build locally
```

Node 20 or newer.

## Fill in your details

Everything personal lives in **`src/content/site.ts`**. Empty values are hidden on the live site; in `npm run dev` they show as dashed reminders.

| Field | What to put |
| --- | --- |
| `email` | The email you want people to use |
| `linkedin` | Your full LinkedIn URL |
| `resumeUrl` | Put `resume.pdf` in `public/`, then set `'/resume.pdf'` |
| `formEndpoint` | Already set to `/api/contact`, the Twilio SendGrid function. See **Contact form** below |
| `aerrandAppStore`, `aerrandGooglePlay` | Store links. Badges appear on the AERRAND case study once set |

Case study copy is in `src/pages/work/Aerrand.tsx` and `src/pages/work/BrainBox.tsx`. App screens are in `src/assets/` and listed in `src/content/screens.ts`.

## Contact form

Messages go to your inbox through Twilio SendGrid, using the function in `api/contact.ts`. It runs on Vercel.

1. Create a free SendGrid account, then go to Settings, Sender Authentication. Verify a single sender (your email), or authenticate your domain once you have one. Domain authentication keeps messages out of spam.
2. Go to Settings, API Keys and create a key with Mail Send access only.
3. In Vercel, open the project, then Settings, Environment Variables. Add `SENDGRID_API_KEY`, `CONTACT_FROM_EMAIL` (the verified sender) and `CONTACT_TO_EMAIL` (where you want messages). Redeploy.

A hidden field catches most spam bots. If the function isn't available (a static host, or `npm run dev`), the form opens the visitor's email app instead.

## Link previews

`public/og.jpg` is the image LinkedIn, iMessage and others show when the site is shared. Once you have a domain, change `/og.jpg` in `index.html` (two places) to the full address, for example `https://arnoldihechere.com/og.jpg`. Some sites only read full addresses.

## Deploy

**Vercel** (recommended): import the repo, keep the defaults. `vercel.json` already sends every route to `index.html`.

**Netlify**: build command `npm run build`, publish directory `dist`. `public/_redirects` handles routes.

**A host without rewrites** (GitHub Pages, plain file hosting): build with hash URLs instead:

```bash
VITE_ROUTER=hash npm run build
```

## How it's put together

- `src/lib/router.tsx`: a small router with page transitions and real browser history, so the Back button returns to the previous page (or to the parent page if someone lands directly on a case study).
- `src/components/Door.tsx`: the roll-up door used for the first load and between pages.
- `src/components/Conveyor.tsx`: the overhead line on the home page. Phones hang from trolleys and swing with scroll speed.
- `src/components/Ecosystem.tsx`: the AERRAND system diagram. One aerrand travels between the five surfaces as you scroll.
- `src/components/devices.tsx`: the CSS iPhone, MacBook and browser frames.
- `src/components/Case.tsx`: shared case-study parts (chapter menu, headings, next case).

Motion respects `prefers-reduced-motion`: everything is still readable, just without the movement.

## Fonts

Self-hosted in `public/fonts` under the SIL Open Font License: Big Shoulders Display and Stencil (display and numbers), Barlow (text) and Atkinson Hyperlegible (the reading-support demo).
