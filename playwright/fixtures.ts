import { test as baseTest } from '@playwright/test';
import { PageManager } from '../src/ui/PageManager';

export type TestFixtures = {
  pm: PageManager;
  takeScreenshot: (filename: string) => Promise<void>;
};

const d = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const testRunTimestamp = `testrun_${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

export const test = baseTest.extend<TestFixtures>({
  pm: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  takeScreenshot: async ({ page }, use, testInfo) => {
    const match = testInfo.title.match(/^\[(.+?)\]/);
    const testId = match ? match[1] : `test_${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const dir = `test-results/screenshots/${testId}/${testRunTimestamp}`;

    await use(async (filename: string) => {
      const screenshot = await page.screenshot({ path: `${dir}/${filename}.png` });
      await testInfo.attach(filename, { body: screenshot, contentType: 'image/png' });
    });
  },
});

export { expect } from '@playwright/test';
