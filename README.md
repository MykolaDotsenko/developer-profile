# Developer Profile — Mykola Dotsenko

Recruiter-facing portfolio and print-ready CV for my software engineering work.

**Live:** https://mykoladotsenko.github.io/developer-profile/

[Resume](https://mykoladotsenko.github.io/developer-profile/resume.html) ·
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

## Selected projects

The site intentionally shows a small set of projects that demonstrate different engineering problems rather than every repository I have built.

| Project | Stack | Why it is here |
| --- | --- | --- |
| [Cultural Currency Converter](https://github.com/MykolaDotsenko/cultural-currency-converter) | Python · Django · PostgreSQL · HTMX | Current/historical FX semantics, external providers, provenance and graceful degradation |
| [DomoNest](https://github.com/MykolaDotsenko/domonest) | Python · Django · Wagtail · PostgreSQL | Cross-feature household workflows, database constraints and derived state |
| [Turku Departures](https://github.com/MykolaDotsenko/foli-live-departures) | React · GTFS/SIRI · PWA | Realtime vs scheduled data, stale states, GPS edge cases and offline use |
| [JunaLippu](https://github.com/MykolaDotsenko/JunaLippu) | Next.js · TypeScript · tRPC · Prisma | Segment-aware inventory and race-safe booking protected at the database boundary |
| [Shopping Budget Companion](https://github.com/MykolaDotsenko/shopping-budget-companion) | React · TypeScript · Zod · PWA | Exact-money arithmetic, durable local state, offline use and on-device camera helpers |
| [Tradeoff — Decision Lab](https://github.com/MykolaDotsenko/tradeoff-decision-lab) | React · TypeScript · Zod | Explainable decision support that keeps score, evidence confidence and sensitivity separate |

Additional examples include [RPS League — Reaktor](https://github.com/MykolaDotsenko/reaktor-rps-league), [MovieShelf](https://github.com/MykolaDotsenko/movieshelf), and [Pakettitutka](https://github.com/MykolaDotsenko/pakettitutka).

## This site

The portfolio is deliberately plain **HTML + CSS**. It does not need a frontend framework or client-side application runtime.

The repository also contains:

- a separate two-page print-ready resume;
- responsive and print styles;
- social-preview assets;
- static link/file validation;
- GitHub Actions checks for HTML and repository references.

## Local preview

```bash
python -m http.server 8000
```

Open:

```text
http://127.0.0.1:8000/
```

Resume:

```text
http://127.0.0.1:8000/resume.html
```

## Checks

```bash
python scripts/check_site.py
```

## Author

**Mykola Dotsenko**  
Software Engineer — Python/Django · Backend · Data Integrations
