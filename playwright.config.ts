import { defineConfig } from '@playwright/test';
import 'dotenv/config';
import * as os from 'node:os';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'UI',
      testDir: './tests/ui',
      use: {
        browserName: 'chromium',
        headless: !process.env.PWDEBUG,
      },
    },
    {
      name: 'API',
      testDir: './tests/api',
      use: {
        browserName: 'chromium',
        headless: !process.env.PWDEBUG,
      },
    },

  ],
});
