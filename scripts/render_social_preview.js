// Renders social-preview.png (1200×630, used for og:image and twitter:image) from the site's
// own font, portrait, and knot. Run with: npm run social-preview

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("@playwright/test");

const ROOT = path.resolve(__dirname, "..");
const TYPES = { ".svg": "image/svg+xml", ".webp": "image/webp", ".woff2": "font/woff2" };

// Inlined as data URLs: a page built with setContent may not load file:// resources.
const asset = (relative) => {
  const type = TYPES[path.extname(relative)];
  const data = fs.readFileSync(path.join(ROOT, relative)).toString("base64");
  return `data:${type};base64,${data}`;
};

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
      @font-face {
        font-family: "Fraunces";
        font-weight: 100 900;
        src: url("${asset("assets/fonts/fraunces-latin-opsz-normal.woff2")}") format("woff2");
      }
      @font-face {
        font-family: "Fraunces";
        font-style: italic;
        font-weight: 100 900;
        src: url("${asset("assets/fonts/fraunces-latin-wght-italic.woff2")}") format("woff2");
      }
      * { box-sizing: border-box; }
      body {
        width: 1200px;
        height: 630px;
        margin: 0;
        overflow: hidden;
        background:
          radial-gradient(900px 500px at 92% 0%, rgba(223, 232, 221, 0.9), transparent 70%),
          repeating-linear-gradient(0deg, rgba(18, 59, 45, 0.02) 0 1px, transparent 1px 6px),
          #f4f0e7;
        color: #152019;
        font-family: "Helvetica Neue", Arial, sans-serif;
      }
      .frame {
        position: absolute;
        inset: 34px;
        border: 1px solid rgba(120, 114, 103, 0.55);
      }
      .frame::before {
        position: absolute;
        top: -1px;
        left: -1px;
        width: 150px;
        height: 3px;
        background: #b08a4a;
        content: "";
      }
      .copy {
        position: absolute;
        top: 96px;
        left: 86px;
        width: 700px;
      }
      .eyebrow {
        margin: 0 0 22px;
        color: #123b2d;
        font-family: ui-monospace, Menlo, Consolas, monospace;
        font-size: 17px;
        font-weight: 700;
        letter-spacing: 0.09em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0 0 22px;
        color: #0b2b20;
        font-family: "Fraunces", serif;
        font-size: 104px;
        font-weight: 560;
        letter-spacing: -0.045em;
        line-height: 0.92;
      }
      .statement {
        margin: 0;
        color: #0b2b20;
        font-family: "Fraunces", serif;
        font-size: 42px;
        font-weight: 480;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .statement em {
        color: #315947;
        font-weight: 420;
      }
      .footer {
        position: absolute;
        bottom: 70px;
        left: 86px;
        display: flex;
        gap: 26px;
        color: #4f5a52;
        font-family: ui-monospace, Menlo, Consolas, monospace;
        font-size: 17px;
      }
      .footer strong { color: #123b2d; }
      .portrait {
        position: absolute;
        top: 82px;
        right: 96px;
        width: 300px;
        height: 375px;
        outline: 1px solid rgba(176, 138, 74, 0.7);
        outline-offset: 7px;
        box-shadow: 0 30px 60px rgba(11, 43, 32, 0.22);
      }
      .portrait img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 20%;
      }
      .seal {
        position: absolute;
        right: -30px;
        bottom: -30px;
        display: grid;
        width: 104px;
        height: 104px;
        place-items: center;
        border: 1px solid rgba(176, 138, 74, 0.6);
        border-radius: 50%;
        background: #fffdf7;
        box-shadow: 0 16px 34px rgba(11, 43, 32, 0.2);
      }
      .seal img { width: 80px; height: 80px; }
    </style>
  </head>
  <body>
    <div class="frame"></div>
    <div class="copy">
      <p class="eyebrow">Software Engineer · Turku, Finland</p>
      <h1>Mykola Dotsenko</h1>
      <p class="statement">I build Python/Django backends, <em>integrations, and data-heavy products.</em></p>
    </div>
    <div class="footer">
      <span><strong>Python · Django · PostgreSQL</strong></span>
      <span>mykoladotsenko.github.io/developer-profile</span>
    </div>
    <div class="portrait">
      <img src="${asset("assets/img/avatar-duotone.webp")}" alt="">
      <span class="seal"><img src="${asset("assets/img/knot.svg")}" alt=""></span>
    </div>
  </body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() => [
    ...[...document.images].filter((image) => image.naturalWidth === 0).map((image) => image.className || "img"),
    ...(document.fonts.check('560 104px "Fraunces"') ? [] : ["Fraunces font"]),
  ]);
  if (missing.length > 0) {
    throw new Error(`Social preview assets failed to load: ${missing.join(", ")}`);
  }
  await page.screenshot({ path: path.join(ROOT, "social-preview.png") });
  await browser.close();
  console.log("Wrote social-preview.png");
})();
