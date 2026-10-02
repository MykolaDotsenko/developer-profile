const { defineConfig, devices } = require("@playwright/test");

const PORT = 4173;

module.exports = defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}/developer-profile/`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/serve.js",
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/developer-profile/index.html`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
