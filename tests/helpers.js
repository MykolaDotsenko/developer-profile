const AxeBuilder = require("@axe-core/playwright").default;

const EMAIL = "docnikolaj1990@gmail.com";

/** Record console errors, page errors, failed requests, error responses, and third-party requests. */
function trackProblems(page) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(`console error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
  page.on("requestfailed", (request) => problems.push(`request failed: ${request.url()}`));
  page.on("request", (request) => {
    const { hostname } = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(hostname) && !request.url().startsWith("data:")) {
      problems.push(`third-party request: ${request.url()}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      problems.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  return problems;
}

/** Scroll through the whole page so lazy images load and scroll-triggered content reveals. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight / 2));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
}

async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

/** Relative luminance of the computed body background, 0 (black) to 1 (white). */
async function backgroundLuminance(page) {
  return page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body)
      .backgroundColor.match(/\d+(\.\d+)?/g)
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  });
}

async function axeViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5),
  }));
}

module.exports = {
  EMAIL,
  axeViolations,
  backgroundLuminance,
  horizontalOverflow,
  scrollThrough,
  trackProblems,
};
