import { expect, Page, test } from '@playwright/test';

const BASE = 'http://localhost:5199';

async function ready(page: Page) {
  await page.goto(BASE);
  await page.evaluate(() => document.fonts.ready);
  // settle initial layout/measure passes (button-group width measurement etc.)
  await page.waitForTimeout(400);
}

const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

for (const scheme of ['light', 'dark'] as const) {
  test(`playground sections — ${scheme}`, async ({ page }) => {
    await ready(page);
    if (scheme === 'dark') {
      await page.getByRole('checkbox').first().check();
      await page.waitForTimeout(200);
    }
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(10);
    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const title = (await section.locator('h2').first().textContent()) ?? `section-${i}`;
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120); // let sticky/lazy layout settle
      await expect(section).toHaveScreenshot(`${slug(title)}-${scheme}.png`, {
        // FAB menu / dialogs overflow their section; clip to the section box
        maxDiffPixelRatio: 0.002,
      });
    }
  });
}
