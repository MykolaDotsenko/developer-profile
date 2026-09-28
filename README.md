# Developer Profile — Mykola Dotsenko

My portfolio and print-friendly CV.

**Live:** https://mykoladotsenko.github.io/developer-profile/

[Resume](https://mykoladotsenko.github.io/developer-profile/resume.html) ·
[LinkedIn](https://www.linkedin.com/in/mykola-dotsenko/) ·
[GitHub](https://github.com/MykolaDotsenko)

![Mykola Dotsenko — Software Engineer](social-preview.png)

I work mostly with Python/Django, PostgreSQL, CRM and API integrations, search, document flows, and production data issues.

At Bo, that includes Kivi, OviPro, and HubSpot data at roughly 200k-contact scale, identity matching, synchronization, production fixes, and query-performance work. I also build frontend parts with React, Next.js, TypeScript, and HTMX when they belong to the same feature.

Before software I worked in agriculture, greenhouse and food production, accounting, sales, and customer-facing roles.

## Projects

### [Cultural Currency Converter](https://github.com/MykolaDotsenko/cultural-currency-converter)

**Python · Django · PostgreSQL · HTMX · Redis**

A travel-money app with current and historical exchange rates. It keeps the source and effective date visible, and the core conversion still works if optional providers fail.

### [DomoNest](https://github.com/MykolaDotsenko/domonest)

**Python · Django · Wagtail · PostgreSQL**

A household app connecting pantry, recipes, shopping, and recurring tasks. Database constraints and derived views keep those features from drifting apart.

### [Turku Departures](https://github.com/MykolaDotsenko/foli-live-departures)

**React · Vite · GTFS/SIRI · PWA**

A Turku transit PWA that deals with stale live data, repeated stops, weak GPS, offline use, and GTFS/SIRI timing edge cases.

[Live demo](https://mykoladotsenko.github.io/foli-live-departures/)

### [JunaLippu](https://github.com/MykolaDotsenko/JunaLippu)

**Next.js · TypeScript · tRPC · Prisma**

A Finnish rail-booking demo with segment-level seat inventory and a database constraint that prevents concurrent overbooking.

### [Shopping Budget Companion](https://github.com/MykolaDotsenko/shopping-budget-companion)

**React · TypeScript · Zod · PWA**

A local-first shopping budget app with exact-money arithmetic, versioned browser storage, offline use, and barcode/OCR/image-recognition helpers.

[Live demo](https://mykoladotsenko.github.io/shopping-budget-companion/)

### [RPS League — Reaktor](https://github.com/MykolaDotsenko/reaktor-rps-league)

**Next.js · TypeScript · Zod**

A Reaktor assignment built around a difficult legacy API with pagination, malformed records, duplicates, rate limits, and inconsistent payloads.

[Live demo](https://reaktor-rps-zeta.vercel.app/)

### [Tradeoff — Decision Lab](https://github.com/MykolaDotsenko/tradeoff-decision-lab)

**React · TypeScript · Zod · Vercel**

A comparison tool where score, confidence, and sensitivity are separate. AI can help prepare the inputs, but regular code calculates the ranking.

[Live demo](https://tradeoff-decision-lab.vercel.app/)

### [DayDock](https://github.com/MykolaDotsenko/daydock)

**React · TypeScript · Local-first**

A browser-only workday planner for notes, priorities, focus blocks, follow-ups, and daily review.

[Live demo](https://mykoladotsenko.github.io/daydock/)

## This site

The site is plain HTML and CSS. It does not need a frontend runtime.

The repo also contains:

- a separate printable resume;
- responsive styles;
- social preview assets;
- a local-link checker;
- GitHub Actions checks for HTML and file references.

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

## Author

**Mykola Dotsenko**  
Software Engineer — Python/Django · Backend · Data Integrations
