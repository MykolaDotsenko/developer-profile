# Developer Profile — Mykola Dotsenko

**Backend/data-focused Software Engineer working with Python/Django, production integrations, data reconciliation, reliable web systems, and AI-enabled product workflows.**

[Live profile](https://mykoladotsenko.github.io/developer-profile/) ·
[Recruiter CV](https://mykoladotsenko.github.io/developer-profile/resume.html) ·
[LinkedIn](https://www.linkedin.com/in/mykola-dotsenko/) ·
[GitHub](https://github.com/MykolaDotsenko)

![Mykola Dotsenko — Software Engineer](social-preview.png)

This repository is the recruiter-facing hub for my software-engineering work. It is intentionally lightweight: the public profile and CV are built with semantic HTML and modern CSS so the content, evidence, and project selection stay more important than the site framework.

## Current positioning

My strongest engineering work is in:

- **Python / Django backend systems**
- **multi-source data and CRM integrations**
- **data reconciliation and identity resolution**
- **PostgreSQL / SQL / Django ORM**
- **REST APIs and provider boundaries**
- **idempotent and recoverable workflows**
- **production debugging and reliability**
- **AI-enabled product features with deterministic guardrails**
- **full-stack delivery with React, Next.js, TypeScript, HTMX, and accessible web UI**

The profile also reflects 8+ years of earlier experience across agriculture, agribusiness, greenhouse/food production, accounting, and sales. That background is particularly useful for **AgTech, vertical SaaS, operational software, and data-heavy business products**.

## Recruiter CV

The dedicated [resume](https://mykoladotsenko.github.io/developer-profile/resume.html) is designed as a concise two-page recruiter document.

It emphasizes:

- 2+ years of production software-development experience;
- current backend/data specialization rather than older junior/frontend positioning;
- production work across Kivi, OviPro, and HubSpot at roughly 200k-record scale;
- reconciliation, identity resolution, synchronization, data-quality and reliability work;
- measurable performance impact;
- enough frontend/full-stack evidence to show end-to-end delivery capability;
- MSc Software Engineering in progress;
- earlier agriculture/business background as domain advantage rather than unrelated history;
- selected projects chosen for engineering signal, not project count.

The print layout is deliberately conservative and ATS-friendly: semantic headings, normal text flow, plain technology names, no icon-only information, and no JavaScript dependency.

## Engineering profile

Across professional and personal work, a few principles repeat consistently:

### Evidence before fixes

Reproduce the actual failure, identify the authoritative data source, quantify the affected scope, and then change the smallest boundary that solves the root cause.

### Explicit state ownership

Avoid duplicated sources of truth. Derived data stays derived where possible; business invariants live in the domain/database layer that can actually protect them.

### Safe uncertainty

When the available evidence is ambiguous, prefer an explicit unknown/review state over a plausible but potentially wrong automatic decision.

### Recoverable systems

Design important writes and synchronization flows to be retryable or idempotent, validate persisted/external data at boundaries, and make degraded behavior visible.

### Proportional architecture

Do not add a framework, service, state library, database, AI layer, or distributed component unless the product requirement justifies its operational and cognitive cost.

### AI as an interface layer

LLMs are useful for interpretation, explanation, and acceleration. Deterministic financial, operational, ranking, or domain rules remain the source of truth where correctness matters.

## Selected public engineering work

### [DomoNest](https://github.com/MykolaDotsenko/domonest)

**Python · Django · Wagtail · PostgreSQL**

A household operating system built around connected workflows rather than isolated CRUD. It demonstrates derived read models, deterministic recurrence, database-enforced invariants, idempotent Recipe/Pantry → Shopping writes, owner-scoped private state, server-rendered progressive enhancement, browser QA, and production deployment hardening.

### [Cultural Currency Converter](https://github.com/MykolaDotsenko/cultural-currency-converter)

**Python · Django · PostgreSQL · HTMX · Redis**

A travel-money product with explicit current/historical FX semantics, provider boundaries, provenance-aware context, optional AI explanations with deterministic fallback, runtime health checks, CSP/browser verification, backup/restore, and safe degradation when optional services fail.

### [Shopping Budget Companion](https://github.com/MykolaDotsenko/shopping-budget-companion)

**React · TypeScript · Zod · PWA**

A local-first exact-money product. Canonical money uses integer minor units; persistence is versioned and recovery-aware; barcode, OCR, and on-device visual recognition remain advisory until the shopper confirms the result through the normal domain flow.

### [Turku Departures](https://github.com/MykolaDotsenko/foli-live-departures)

**React · Vite · GTFS/SIRI · PWA**

A privacy-first transit decision layer for Turku. It keeps live, scheduled, stale, and unknown states distinct; handles loop routes, unreliable GPS, offline operation and provider failures; and uses cross-browser, accessibility, localization, and PWA release gates.

### [JunaLippu](https://github.com/MykolaDotsenko/JunaLippu)

**Next.js · TypeScript · tRPC · Prisma**

A railway-booking case study with segment-aware inventory, database-enforced concurrency safety, owner-scoped reservations, integration tests, and GTFS service-time edge cases.

### [Tradeoff — Decision Lab](https://github.com/MykolaDotsenko/tradeoff-decision-lab)

**React · TypeScript · Zod · Vercel Functions**

An explainable decision-support workspace that deliberately separates deterministic preference score, evidence confidence, and sensitivity. AI can structure or challenge a decision, but never becomes the ranking engine.

### [DayDock](https://github.com/MykolaDotsenko/daydock)

**React · TypeScript · Local-first**

A workday planner for capture, priorities, focus blocks, follow-ups, and daily review. Personal planning data stays in the browser, with a live demo at https://mykoladotsenko.github.io/daydock/.


## Product thinking

The project themes are intentionally different, but the product logic is consistent.

I tend to build software around the point where a user has to make a decision:

- transport data → **what should I do now?**
- currency rates → **what does this amount mean locally?**
- household state → **what needs attention today?**
- shopping prices → **what can I still spend safely?**
- movie preferences → **what can this group agree to?**
- option scoring → **how robust is this decision?**
- farm data → **what action improves the economic result, and can the effect be verified?**

The recurring product model is:

```text
messy real-world information
        ↓
structured state
        ↓
explicit uncertainty
        ↓
decision support
        ↓
clear next action
        ↓
observable outcome
```

## Portfolio implementation

For this particular site, a frontend framework would add maintenance surface without meaningful product value.

The runtime is therefore:

- semantic HTML5;
- modern responsive CSS;
- CSS Grid and Flexbox;
- fluid typography;
- accessible focus states;
- reduced-motion support;
- Open Graph/social metadata;
- **zero runtime JavaScript**;
- **zero application dependencies**.

The implementation choice is part of the engineering signal: use the simplest architecture that fully serves the product.

## Repository structure

```text
.
├── .github/
│   └── workflows/
│       └── quality.yml
├── scripts/
│   └── check_local_links.py
├── avatar.jpg
├── favicon.svg
├── social-preview.png
├── index.html
├── resume.html
├── resume.css
├── styles.css
└── README.md
```

## Quality checks

Pull requests and pushes to `main` verify:

1. HTML validity;
2. internal anchors and local file references;
3. Python syntax for the local-link validator.

The quality tooling stays deliberately smaller than the product repositories because the runtime surface here is also deliberately small.

## Local preview

No application installation is required.

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

Resume:

```text
http://127.0.0.1:8000/resume.html
```

## Author

**Mykola Dotsenko**  
Software Engineer — Python/Django · Backend · Data · AI Integrations

[LinkedIn](https://www.linkedin.com/in/mykola-dotsenko/) ·
[GitHub](https://github.com/MykolaDotsenko)
