# Developer Profile — Mykola Dotsenko

Recruiter-facing portfolio and print-ready CV for my software engineering work.

**Live:** https://mykoladotsenko.github.io/developer-profile/

[Resume](https://mykoladotsenko.github.io/developer-profile/resume.html) ·
[PDF](https://mykoladotsenko.github.io/developer-profile/Mykola-Dotsenko-Resume.pdf) ·
[Email](mailto:docnikolaj1990@gmail.com) ·
[LinkedIn](https://www.linkedin.com/in/mykola-dotsenko/) ·
[GitHub](https://github.com/MykolaDotsenko)

![Mykola Dotsenko — Software Engineer](social-preview.png)

## What I work on

My main stack is **Python / Django / PostgreSQL**, with React, Next.js, TypeScript and HTMX when a feature needs frontend work.

At Bo, my work includes CRM and property-data integrations, search, document flows, synchronization and production debugging. Recent examples include:

- reconciliation across roughly **200k CRM/contact records** from Kivi, OviPro and HubSpot;
- reducing one search path from **3.5s to about 300ms**;
- resolving roughly **1,600 duplicate assignment records** and tightening the ingestion rules behind them.

Before software I worked across agriculture, greenhouse and food production, accounting, sales and customer-facing operations.

**Languages:** English (C1) · Finnish (A1–A2) · Ukrainian (native)

## Selected projects

The site intentionally shows a small set of projects that demonstrate different engineering problems rather than every repository I have built.

| Project | Stack | Why it is here |
| --- | --- | --- |
| [Cultural Currency Converter](https://github.com/MykolaDotsenko/cultural-currency-converter) | Python · Django · PostgreSQL · HTMX · Redis | Current/historical FX semantics, external providers, provenance and graceful degradation |
| [DomoNest](https://github.com/MykolaDotsenko/domonest) | Python · Django · Wagtail · PostgreSQL | Cross-feature household workflows, database constraints and derived state |
| [Turku Departures](https://github.com/MykolaDotsenko/foli-live-departures) | React · GTFS/SIRI · PWA | Realtime vs scheduled data, stale states, GPS edge cases and offline use |
| [JunaLippu](https://github.com/MykolaDotsenko/JunaLippu) | Next.js · TypeScript · tRPC · Prisma | Segment-aware inventory and race-safe booking protected at the database boundary |
| [Shopping Budget Companion](https://github.com/MykolaDotsenko/shopping-budget-companion) | React · TypeScript · Zod · PWA | Exact-money arithmetic, durable local state, offline use and on-device camera helpers |
| [Tradeoff — Decision Lab](https://github.com/MykolaDotsenko/tradeoff-decision-lab) | React · TypeScript · Zod | Explainable decision support that keeps score, evidence confidence and sensitivity separate |

Additional examples include [RPS League — Reaktor](https://github.com/MykolaDotsenko/reaktor-rps-league), [MovieShelf](https://github.com/MykolaDotsenko/movieshelf), and [Pakettitutka](https://github.com/MykolaDotsenko/pakettitutka).

## This site

The portfolio is plain **HTML + CSS** with one small, optional script. It does not need a frontend framework or build step, and every section reads the same with JavaScript turned off.

- **Light and dark themes** — follows the system setting, with a toggle that remembers the choice.
- **Motion with restraint** — the knot draws itself around the portrait and turns as the page scrolls, sections ease in, the impact numbers count up. All of it is skipped under `prefers-reduced-motion`.
- **Interactive reconciliation demo** — four illustrative records from Kivi, OviPro and HubSpot are normalised, matched and merged step by step, and the ambiguous one goes to review. It plays once by itself (under five seconds) the first time it scrolls into view. The data is made up.
- **Two-page print-ready resume** — A4, checked by a test so it never spills onto a third page.
- **Downloadable PDF** — `Mykola-Dotsenko-Resume.pdf` is rendered from `resume.html` with `npm run resume-pdf` (tagged, with selectable text and working links). The static checks fail if the resume changes and the PDF is not regenerated.
- **Self-hosted assets** — the Fraunces display font and the Inter text face used by the resume (both SIL OFL, see `assets/fonts/Fraunces-OFL.txt` and `assets/fonts/Inter-OFL.txt`) and all images live in `assets/`, so the site makes no third-party requests.
- **Social preview** — `social-preview.png` is rendered from the same font and portrait with `npm run social-preview`.

After editing `resume.html` or `resume.css`, run `npm run resume-pdf` and commit the new PDF with it.

## Local preview

```bash
python -m http.server 8000
```

Open http://127.0.0.1:8000/ for the portfolio and http://127.0.0.1:8000/resume.html for the resume.

## Checks

Static checks (Python standard library only): local links and anchors, image dimensions, truncated or corrupted PNG/WebP files, unused assets, undefined CSS custom properties, `target="_blank"` links, and a resume PDF that is two pages and up to date.

```bash
python scripts/check_site.py
```

HTML validation and browser tests (Playwright, Chromium, axe-core):

```bash
npm ci
npx playwright install chromium
npm run validate
npm test
```

The browser tests cover layout at phone to desktop widths, section order, both themes, reduced motion, JavaScript turned off, the reconciliation demo and its autoplay, the PDF download, accessibility (axe), and the two-page print layout. GitHub Actions runs all of it on every push and pull request.

## Author

**Mykola Dotsenko**  
Software Engineer — Python/Django · Backend · Data Integrations
