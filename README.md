# m3x — Material 3 Expressive for React

A React component library that faithfully implements **Material Design 3**, including the
**M3 Expressive** update — visuals, design tokens, *and* motion physics.

> **Not affiliated with or endorsed by Google.** Material Design is a design system published
> by Google under open licenses; this project implements the public specification at
> [m3.material.io](https://m3.material.io). Portions reference Apache-2.0 sources
> (`@material/web`, Jetpack Compose `material3`, `androidx.graphics.shapes`) with attribution.

## Packages

| Package | Purpose |
|---|---|
| `@m3x/tokens` | Design tokens: dynamic color (HCT, all scheme variants), typography (incl. Expressive *emphasized* styles), shape (corner tokens + morphable shape library), elevation, state layers, **motion-physics spring tokens** |
| `@m3x/primitives` | Shared behavior/visual primitives: `Ripple`, `FocusRing`, `Elevation`, `Icon`, spring solver + `useSpringValue`, shape morphing, `ThemeProvider` |
| `@m3x/react` | Components — Phase 1: Button, IconButton, FAB / Extended FAB · Phase 2 (Expressive signature set): ButtonGroup (press "bump"), SplitButton, FabMenu, LoadingIndicator (shape-morph), Linear/CircularProgress (wavy), Docked/FloatingToolbar · Phase 3 (inputs): TextField, Checkbox, Radio, Switch, Slider (Expressive), Chips · Phase 4 (containment & navigation): Card, Dialog, Snackbar, Badge, Divider, Tabs, NavigationBar, TopAppBar, NavigationRail, Menu, List, Tooltip/RichTooltip, BottomSheet, SearchBar, SegmentedButtons, NavigationDrawer, Carousel, DatePicker, TimePicker, SideSheet |
| `@m3x/playground` | Vite demo app for eyeballing spec fidelity |
| `@m3x/gallery` | Example sites (plan §6.5 composition validation): Gmail-style Mail, Docs-style Editor, media home, Settings — adaptive rail/bar via `useWindowSizeClass`, per-app dynamic color seeds. `pnpm --filter @m3x/gallery dev` |

## Architectural decisions (locked in Phase 1)

- **Motion engine:** custom closed-form spring solver (~1 KB), parameterized *only* by the
  motion tokens (`motion.spatial.*` / `motion.effects.*`). Switching the theme's
  `motionScheme: 'expressive' | 'standard'` retunes every component at once.
  `prefers-reduced-motion` collapses springs to instant/fade.
- **Styling:** precompiled plain CSS + `--md-*` custom properties. No runtime CSS-in-JS.
  Components consume only `--md-sys-*` / `--md-comp-*` variables (token conformance rule).
- **Color:** `@material/material-color-utilities` (official HCT implementation) — never reimplemented.
- **Fonts:** [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex) and
  [Material Symbols](https://fonts.google.com/icons) (both open). Consumers self-host or load
  from any font CDN; the playground shows how.

## Quick start

```bash
pnpm install
pnpm dev        # playground at http://localhost:5173
pnpm test       # unit tests (vitest)
pnpm test:vr    # visual regression (Playwright; --update-snapshots after intentional changes)
pnpm build      # publishable ESM+CJS+d.ts bundles + flattened styles.css per package
```

```tsx
import { ThemeProvider } from '@m3x/primitives';
import { Button } from '@m3x/react';

<ThemeProvider seedColor="#6750A4" schemeVariant="tonalSpot" motionScheme="expressive">
  <Button variant="filled" size="m" shape="round">Get started</Button>
</ThemeProvider>
```

## Releasing

CI runs typecheck/tests/builds on every push ([ci.yml](.github/workflows/ci.yml)).
Publishing to npm is tag-driven ([publish.yml](.github/workflows/publish.yml)):

```bash
git tag v0.1.0 && git push --tags
```

One-time setup: create the free `m3x` org on npmjs.com (or change the package
scope), generate an automation token, and add it as the `NPM_TOKEN` repository
secret on GitHub.

## Spec fidelity

Every component has a spec sheet in [`/specs`](specs/README.md) extracted from
m3.material.io; PRs must trace measurements/tokens to the sheet. See the implementation
plan for the phased roadmap and verification strategy.
