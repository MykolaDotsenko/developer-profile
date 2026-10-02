const { test, expect } = require("@playwright/test");
const {
  EMAIL,
  axeViolations,
  backgroundLuminance,
  horizontalOverflow,
  scrollThrough,
  trackProblems,
} = require("./helpers");

const WIDTHS = [320, 390, 768, 1024, 1366, 1920];

test.describe("portfolio page", () => {
  test("loads cleanly with only first-party requests", async ({ page }) => {
    const problems = trackProblems(page);
    await page.goto("index.html");
    await scrollThrough(page);
    await page.waitForLoadState("networkidle");

    expect(problems).toEqual([]);
    const brokenImages = await page.$$eval("img", (images) =>
      images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
    );
    expect(brokenImages).toEqual([]);
    expect(await page.evaluate(() => document.fonts.check('500 48px "Fraunces"'))).toBe(true);
  });

  for (const width of WIDTHS) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("index.html");
      await scrollThrough(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }

  test("shows name, role, call to action, and portrait on the first screen", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("index.html");

    for (const locator of [
      page.getByRole("heading", { level: 1, name: "Mykola Dotsenko" }),
      page.getByRole("link", { name: "View selected work" }),
      page.getByRole("img", { name: "Portrait of Mykola Dotsenko" }),
    ]) {
      await expect(locator).toBeInViewport({ ratio: 1 });
    }
  });

  test("project grid leaves no empty cell at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("index.html");

    const rows = await page.$eval(".project-grid", (grid) => {
      const gridBox = grid.getBoundingClientRect();
      const byRow = new Map();
      for (const card of grid.children) {
        const box = card.getBoundingClientRect();
        const key = Math.round(box.top);
        byRow.set(key, (byRow.get(key) || 0) + box.width);
      }
      return [...byRow.values()].map((used) => used / gridBox.width);
    });

    for (const filled of rows) {
      expect(filled).toBeGreaterThan(0.95);
    }
  });

  test("project cards keep their content left-aligned on phones", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("index.html");

    const offsets = await page.$$eval(".project-card h3", (headings) =>
      headings.map((heading) => heading.getBoundingClientRect().left - heading.parentElement.getBoundingClientRect().left),
    );
    for (const offset of offsets) {
      expect(offset).toBeLessThan(16);
    }
  });

  test("the featured screenshot reserves its space before it loads", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("index.html");

    const screenshot = page.locator(".project-visual img");
    expect(await screenshot.evaluate((image) => image.complete)).toBe(false);
    const box = await screenshot.boundingBox();
    expect(box.height).toBeGreaterThan(250);
    expect(box.height / box.width).toBeCloseTo(625 / 500, 1);
  });

  test("'More work' links share one row next to their label on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("index.html");

    const boxes = await page.$$eval(".more-work > *", (items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return { top: Math.round(box.top), left: box.left, width: box.width };
      }),
    );
    const [label, ...links] = boxes;
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.top).toBe(links[0].top);
      expect(link.left).toBeGreaterThanOrEqual(label.left + label.width - 1);
      expect(link.width).toBeGreaterThan(200);
    }
  });

  test("email is offered in the hero, contact section, and structured data", async ({ page }) => {
    await page.goto("index.html");

    const mailtos = await page.$$eval("a[href^='mailto:']", (links) => links.map((link) => link.href));
    expect(mailtos.length).toBeGreaterThanOrEqual(3);
    expect(new Set(mailtos)).toEqual(new Set([`mailto:${EMAIL}`]));

    const person = await page.$eval('script[type="application/ld+json"]', (script) => JSON.parse(script.textContent));
    expect(person["@type"]).toBe("Person");
    expect(person.email).toBe(`mailto:${EMAIL}`);
    expect(person.knowsLanguage).toEqual(["en", "fi", "uk"]);
  });

  test("copy button puts the email on the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("index.html");

    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.locator("[data-copy-status]")).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });

  test("skip link is hidden until focused", async ({ page }) => {
    await page.goto("index.html");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });

    await expect(skipLink).not.toBeInViewport();
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
  });

  test("navigation marks the section in view", async ({ page }) => {
    await page.goto("index.html");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));

    await expect(page.locator(".primary-nav a[href='#projects']")).toHaveAttribute("aria-current", "true");
  });
});

test.describe("themes", () => {
  test("follow a dark system setting", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("index.html");

    expect(await backgroundLuminance(page)).toBeLessThan(0.05);
    await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-pressed", "true");
    await context.close();
  });

  test("toggle switches the theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("index.html");
    const toggle = page.locator("[data-theme-toggle]");

    expect(await backgroundLuminance(page)).toBeGreaterThan(0.7);
    await expect(toggle).toHaveAccessibleName("Switch to dark theme");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveAccessibleName("Switch to light theme");
    await expect.poll(() => backgroundLuminance(page)).toBeLessThan(0.05);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await backgroundLuminance(page)).toBeLessThan(0.05);

    await page.locator("[data-theme-toggle]").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test.describe("motion", () => {
  test("below-the-fold content reveals on scroll and counters land on final values", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 800 });
    await page.goto("index.html");

    const skills = page.locator("#skills .skill-grid");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    await expect(skills).toHaveCSS("opacity", "0");

    await page.locator("[data-impact]").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-impact]")).toHaveClass(/is-visible/);
    await expect(page.locator("[data-count-to='200']")).toHaveText("~200k", { timeout: 4000 });
    await expect(page.locator("[data-count-to='1600']")).toHaveText("~1,600", { timeout: 4000 });
    await expect(page.locator(".speed-bar-after")).toHaveCSS("transform", "none", { timeout: 4000 });

    await skills.scrollIntoViewIfNeeded();
    await expect(skills).toHaveCSS("opacity", "1", { timeout: 4000 });
  });

  test("the knot seal draws itself on load", async ({ page }) => {
    await page.goto("index.html");
    const loop = page.locator(".knot-loop-a");

    const names = await page.evaluate(() =>
      document.getAnimations().map((animation) => animation.animationName),
    );
    expect(names).toContain("knot-draw");
    await expect(loop).toHaveCSS("stroke-dashoffset", "0px", { timeout: 5000 });
  });
});

test.describe("reduced motion", () => {
  // reducedMotion is a browser-context option rather than a test fixture.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("shows everything at once with no running animations", async ({ page }) => {
    await page.goto("index.html");
    await page.waitForTimeout(300);

    await expect(page.locator("html")).not.toHaveClass(/\bmotion\b/);
    const hidden = await page.$$eval("[data-reveal], .hero-step", (elements) =>
      elements.filter((element) => getComputedStyle(element).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
    const running = await page.evaluate(
      () => document.getAnimations().filter((animation) => animation.playState === "running").length,
    );
    expect(running).toBe(0);
  });

  test("has no accessibility violations in light and dark themes", async ({ page }) => {
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto("index.html");
      await scrollThrough(page);
      expect(await axeViolations(page), `${colorScheme} theme`).toEqual([]);

      await page.getByRole("button", { name: "Reconcile records" }).click();
      await expect(page.locator("[data-recon-reset]")).toBeVisible();
      expect(await axeViolations(page), `${colorScheme} theme, demo finished`).toEqual([]);
    }
  });
});

test.describe("reconciliation demo", () => {
  test("normalises, matches, merges, and sends the conflict to review", async ({ page }) => {
    await page.goto("index.html");
    const demo = page.locator("[data-recon]");
    const kiviName = demo.locator(".recon-record").first().locator("dd").first();
    const golden = demo.locator("[data-recon-golden] dl");
    const run = page.getByRole("button", { name: "Reconcile records" });
    const reset = page.getByRole("button", { name: "Reset" });

    await demo.scrollIntoViewIfNeeded();
    await expect(kiviName).toHaveText("VIRTANEN Aino");
    await expect(golden).toBeHidden();
    await expect(reset).toBeHidden();

    await run.click();
    await expect(demo.locator("[data-recon-status]")).toContainText("Normalise", { timeout: 3000 });
    await expect(kiviName).toHaveText("Aino Virtanen");

    await expect(reset).toBeVisible({ timeout: 8000 });
    await expect(golden).toBeVisible();
    await expect(demo.locator("[data-recon-review] p").last()).toBeVisible();
    await expect(demo.locator(".recon-record.is-matched")).toHaveCount(3);
    await expect(demo.locator(".recon-record.is-conflict")).toHaveCount(1);
    await expect(demo.locator(".recon-steps .is-done")).toHaveCount(4);
    await expect(demo.locator("[data-recon-status]")).toContainText("went to review");
    await expect(page.getByRole("button", { name: "Run again" })).toBeEnabled();

    await reset.click();
    await expect(kiviName).toHaveText("VIRTANEN Aino");
    await expect(golden).toBeHidden();
    await expect(demo.locator(".recon-record.is-matched")).toHaveCount(0);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every section is complete and visible", async ({ page }) => {
    await page.goto("index.html");

    const hidden = await page.$$eval("[data-reveal]", (elements) =>
      elements.filter((element) => getComputedStyle(element).opacity !== "1").length,
    );
    expect(hidden).toBe(0);

    await expect(page.locator("[data-count-to='200']")).toHaveText("~200k");
    await expect(page.locator("[data-count-to='1600']")).toHaveText("~1,600");
    await expect(page.locator("[data-recon-golden] dl")).toBeVisible();
    await expect(page.locator("[data-recon-review] p").last()).toBeVisible();
    await expect(page.locator(".recon-record").first().locator("dd").first()).toHaveText("Aino Virtanen");

    // Controls that need JavaScript stay out of the way.
    await expect(page.locator("[data-theme-toggle]")).toBeHidden();
    await expect(page.locator("[data-recon-run]")).toBeHidden();
    await expect(page.locator("[data-copy]")).toBeHidden();
  });
});

test.describe("404 page", () => {
  test("answers unknown paths with a styled page that links home", async ({ page }) => {
    const problems = trackProblems(page);
    const response = await page.goto("no-such-page");

    expect(response.status()).toBe(404);
    // The 404 document itself is expected; any other failed asset still shows up with its URL.
    const unexpected = problems.filter(
      (problem) => !problem.includes("no-such-page") && !problem.startsWith("console error: Failed to load resource"),
    );
    expect(unexpected).toEqual([]);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Two systems disagree.");

    await page.getByRole("link", { name: "Portfolio" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Mykola Dotsenko" })).toBeVisible();
  });
});
