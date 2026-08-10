import { expect, test } from '@playwright/test';

const BASE = 'http://localhost:5198';
const APPS = ['Mail', 'Editor', 'Media', 'Settings'];

test('gallery apps', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BASE);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  for (const app of APPS) {
    await page.getByRole('button', { name: app, exact: true }).click();
    await page.waitForTimeout(400); // springs resolve instantly (reduced motion)
    await expect(page).toHaveScreenshot(`gallery-${app.toLowerCase()}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.002,
      // the media screen animates its progress bar continuously; mask it
      mask: [page.locator('.m3x-linear-progress'), page.locator('.m3x-loading-indicator')],
    });
  }
});
