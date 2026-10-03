const { test, expect } = require("@playwright/test");
const { EMAIL, axeViolations, horizontalOverflow, trackProblems } = require("./helpers");

const A4_HEIGHT_PX = (297 / 25.4) * 96;
const MIN_PRINT_TEXT_PX = (8.5 / 72) * 96;

test.describe("resume page", () => {
  test("loads cleanly and has no accessibility violations", async ({ page }) => {
    const problems = trackProblems(page);
    await page.goto("resume.html");
    await page.waitForLoadState("networkidle");

    expect(problems).toEqual([]);
    expect(await axeViolations(page)).toEqual([]);
  });

  test("leads with email and languages", async ({ page }) => {
    await page.goto("resume.html");
    const header = page.locator(".cv-header");

    await expect(header.getByRole("link", { name: EMAIL })).toHaveAttribute("href", `mailto:${EMAIL}`);
    await expect(header).toContainText("English (C1)");
    await expect(header).toContainText("Finnish (A1–A2)");
    await expect(header).toContainText("Ukrainian (native)");
  });

  test("links the downloadable PDF from the toolbar", async ({ page }) => {
    await page.goto("resume.html");
    const download = page.getByRole("link", { name: /Download PDF/ });

    await expect(download).toHaveAttribute("href", "Mykola-Dotsenko-Resume.pdf");
    await expect(download).toHaveAttribute("download", "");
    expect(await page.evaluate(() => document.fonts.check('400 12px "Inter"'))).toBe(true);
  });

  test("explains that the Nidos internship was part of BearIT LearnIT", async ({ page }) => {
    await page.goto("resume.html");
    await expect(page.locator(".job", { hasText: "Nidos Ltd." }).first()).toContainText("BearIT LearnIT");
  });

  test("lists education newest first", async ({ page }) => {
    await page.goto("resume.html");
    const startYears = await page.$$eval(".education-list p", (items) =>
      items.map((item) => Number(item.textContent.match(/(\d{4})/)[1])),
    );
    expect(startYears).toEqual([...startYears].sort((a, b) => b - a));
  });

  for (const width of [320, 390, 768, 1366]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("resume.html");
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("resume print", () => {
  test("fits exactly two A4 pages with readable text", async ({ page }) => {
    await page.goto("resume.html");
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });

    const pages = await page.$$eval(".resume-page", (articles) =>
      articles.map((article) => {
        const box = article.getBoundingClientRect();
        const contentBottom = Math.max(
          ...[...article.querySelectorAll("*")].map((element) => element.getBoundingClientRect().bottom),
        );
        return {
          height: box.height,
          room: box.height - parseFloat(getComputedStyle(article).paddingBottom) - (contentBottom - box.top),
        };
      }),
    );

    expect(pages).toHaveLength(2);
    for (const printed of pages) {
      expect(Math.abs(printed.height - A4_HEIGHT_PX)).toBeLessThan(2);
      expect(printed.room).toBeGreaterThanOrEqual(0);
    }

    const smallestBodyText = await page.$$eval(
      ".job li, .skills-rows p, .project-list p, .approach-list li, .profile-summary",
      (elements) => Math.min(...elements.map((element) => parseFloat(getComputedStyle(element).fontSize))),
    );
    expect(smallestBodyText).toBeGreaterThanOrEqual(MIN_PRINT_TEXT_PX);

    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
    expect(pageCount).toBe(2);
  });
});
