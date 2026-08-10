import { defineConfig } from '@playwright/test';

/**
 * Visual regression harness (plan §6.2): screenshots every playground section,
 * light + dark, against checked-in baselines in tests/vr/__screenshots__.
 *
 * Determinism: `reducedMotion: 'reduce'` makes all spring-driven motion resolve
 * instantly (ThemeProvider honors it) and `animations: 'disabled'` freezes CSS
 * animations at screenshot time.
 *
 * Update baselines after an intentional visual change:
 *   pnpm test:vr --update-snapshots
 */
export default defineConfig({
  testDir: 'tests/vr',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    contextOptions: { reducedMotion: 'reduce' },
  },
  webServer: {
    command: 'pnpm --filter @m3x/playground dev',
    env: { PORT: '5199' },
    url: 'http://localhost:5199',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
