// Renders Mykola-Dotsenko-Resume.pdf from resume.html with the same print styles a browser uses.
// Run with: npm run resume-pdf
//
// It also records a hash of everything the PDF is built from. scripts/check_site.py recomputes
// that hash, so CI fails if the resume changes and the PDF is not regenerated.

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = "Mykola-Dotsenko-Resume.pdf";
const HASH_FILE = "scripts/resume-pdf.sha256";

// Keep in sync with RESUME_PDF_INPUTS in scripts/check_site.py.
const INPUTS = [
  "resume.html",
  "resume.css",
  "assets/fonts/fraunces-latin-opsz-normal.woff2",
  "assets/fonts/inter-latin-wght-normal.woff2",
  "scripts/render_resume_pdf.js",
];

function sourceHash() {
  const hash = crypto.createHash("sha256");
  for (const relative of INPUTS) {
    hash.update(relative);
    hash.update("\0");
    hash.update(fs.readFileSync(path.join(ROOT, relative)));
    hash.update("\0");
  }
  return hash.digest("hex");
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(ROOT, "resume.html")).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const missingFonts = await page.evaluate(() =>
    ['460 30px "Fraunces"', '400 12px "Inter"'].filter((font) => !document.fonts.check(font)),
  );
  if (missingFonts.length > 0) {
    throw new Error(`Fonts did not load: ${missingFonts.join(", ")}`);
  }

  await page.pdf({
    path: path.join(ROOT, OUTPUT),
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  await browser.close();

  fs.writeFileSync(path.join(ROOT, HASH_FILE), `${sourceHash()}\n`);
  console.log(`Wrote ${OUTPUT} and ${HASH_FILE}`);
})();
