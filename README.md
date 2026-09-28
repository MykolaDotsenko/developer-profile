# Developer Profile — Mykola Dotsenko

**Software Engineer focused on Python/Django, backend systems, data integrations, and reliable web products.**

[Live site](https://mykoladotsenko.github.io/developer-profile/) · [GitHub profile](https://github.com/MykolaDotsenko) · [LinkedIn](https://www.linkedin.com/in/mykola-dotsenko/)

![Mykola Dotsenko — Software Engineer](social-preview.png)

A lightweight, responsive developer profile focused on software engineering experience, technical strengths, and selected portfolio work.

Built with semantic HTML and modern CSS — intentionally without a JavaScript framework.

## What this project demonstrates

- backend- and data-focused software engineering positioning
- selected production-minded portfolio projects with recruiter-facing engineering evidence
- quantified, public-safe professional impact highlights
- a dedicated printable HTML resume
- semantic, accessible HTML5
- responsive CSS architecture without runtime JavaScript
- lightweight automated quality checks
- deliberate avoidance of unnecessary framework complexity

## Engineering approach

The implementation stays intentionally small.

For this type of product, adding React, Next.js, or another runtime framework would increase complexity without providing meaningful value. A dependency-free HTML/CSS implementation gives the project:

- minimal runtime and dependency surface
- fast loading
- simple deployment
- low maintenance cost
- long-term portability
- clear separation between content and presentation

## Technical highlights

- semantic HTML5 structure
- CSS Grid and Flexbox
- fluid typography with `clamp()`
- reusable design tokens with CSS custom properties
- responsive desktop, tablet, and mobile layouts
- horizontally scrollable mobile navigation without JavaScript
- visible keyboard focus states
- skip-to-content navigation
- `prefers-reduced-motion` support
- Open Graph and social metadata
- lightweight SVG favicon
- automated HTML and local-link validation
- no JavaScript runtime
- no application dependencies

## Project structure

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

## Run locally

No installation is required.

Open `index.html` directly, or serve the directory with any static HTTP server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Quality checks

Pull requests and pushes to `main` run a small GitHub Actions workflow that checks:

1. HTML validity with `html-validate`
2. internal anchors and local file references with `scripts/check_local_links.py`
3. Python syntax for the validation helper

The checks are deliberately narrow: they protect the static site without introducing a full frontend toolchain. The workflow uses current major versions of the official GitHub checkout and Node setup actions.

## Selected work featured on the site

- [Cultural Currency Converter — Django / PostgreSQL / HTMX](https://github.com/MykolaDotsenko/cultural-currency-converter)
- [DomoNest — Django / Wagtail / domain workflows](https://github.com/MykolaDotsenko/domonest)
- [Turku Departures — realtime transit reliability / PWA](https://github.com/MykolaDotsenko/foli-live-departures)
- [JunaLippu — race-safe full-stack booking](https://github.com/MykolaDotsenko/JunaLippu)
- [Shopping Budget Companion — local-first exact-money product](https://github.com/MykolaDotsenko/shopping-budget-companion)
- [RPS League — legacy API normalization](https://github.com/MykolaDotsenko/reaktor-rps-league)

## Author

**Mykola Dotsenko**  
Software Engineer — Python / Django, Backend, Data & Integrations

- [GitHub](https://github.com/MykolaDotsenko)
- [LinkedIn](https://www.linkedin.com/in/mykola-dotsenko/)
