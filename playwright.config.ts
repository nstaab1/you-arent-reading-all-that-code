import { defineConfig, devices } from '@playwright/test';

// The flows start their own feed and web app on these ports, so they always
// run the checked-out code and never collide with `npm run dev`.
const FEED_PORT = '4100';
const WEB_PORT = '5174';

export default defineConfig({
  testDir: 'e2e',
  outputDir: '.net/playwright/results',
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  // The HTML report never opens, so a failing run on stage never pops a browser.
  reporter: [['list'], ['html', { open: 'never', outputFolder: '.net/playwright/report' }]],
  // Lowered from the defaults, so a covered button fails in seconds, not 30.
  timeout: 10_000,
  expect: { timeout: 2_000 },
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    actionTimeout: 2_000,
  },
  // Headless Chromium runs the shell from `playwright install chromium --only-shell`.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run start -w @bestiary/feed',
      url: `http://localhost:${FEED_PORT}/api/creatures`,
      env: { FEED_PORT },
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -w @bestiary/web',
      url: `http://localhost:${WEB_PORT}`,
      env: { FEED_PORT, WEB_PORT },
      reuseExistingServer: false,
    },
  ],
});
