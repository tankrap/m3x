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
| `@ibx34/m3x-tokens` | Design tokens: dynamic color (HCT, all scheme variants), typography (incl. Expressive *emphasized* styles), shape (corner tokens + morphable shape library), elevation, state layers, **motion-physics spring tokens** |
| `@ibx34/m3x-primitives` | Shared behavior/visual primitives: `Ripple`, `FocusRing`, `Elevation`, `Icon`, spring solver + `useSpringValue`, shape morphing, `ThemeProvider` |
| `@ibx34/m3x` | Components — Phase 1: Button, IconButton, FAB / Extended FAB · Phase 2 (Expressive signature set): ButtonGroup (press "bump"), SplitButton, FabMenu, LoadingIndicator (shape-morph), Linear/CircularProgress (wavy), Docked/FloatingToolbar · Phase 3 (inputs): TextField, Checkbox, Radio, Switch, Slider (Expressive), Chips · Phase 4 (containment & navigation): Card, Dialog, Snackbar, Badge, Divider, Tabs, NavigationBar, TopAppBar, NavigationRail, Menu, List, Tooltip/RichTooltip, BottomSheet, SearchBar, SegmentedButtons, NavigationDrawer, Carousel, DatePicker, TimePicker, SideSheet · **Extras (beyond the M3 catalog)**: Text (typescale), Avatar, Select, ComboBox, SelectionCard, Banner, InlineAlert, Toasts (`useToast`), Sidebar, NavBar, Breadcrumbs — extras use extended success/warning/info tonal roles generated with the same HCT machinery. Inputs take `size` (s/m/l frames for TextField/Select/ComboBox, scaled Checkbox/Radio/Switch, spec slider tiers xs–l) |
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
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { Button } from '@ibx34/m3x';

<ThemeProvider seedColor="#6750A4" schemeVariant="tonalSpot" motionScheme="expressive">
  <Button variant="filled" size="m" shape="round">Get started</Button>
</ThemeProvider>
```

## Releasing

CI runs typecheck/tests/builds on every push ([ci.yml](.github/workflows/ci.yml)).
Publishing ([publish.yml](.github/workflows/publish.yml)) is tag-driven, or run
it manually from the Actions tab:

```bash
git tag v0.1.0 && git push --tags
```

One-time setup: on npmjs.com (account `ibx34`) generate a Granular Access
Token with read/write package rights, and add it as the `NPM_TOKEN` repository
secret on GitHub (`gh secret set NPM_TOKEN --repo tankrap/m3x`). No org is
needed — the packages publish under the personal `@ibx34` scope as
`@ibx34/m3x`, `@ibx34/m3x-tokens`, `@ibx34/m3x-primitives`.

## Spec fidelity

Every component has a spec sheet in [`/specs`](specs/README.md) extracted from
m3.material.io; PRs must trace measurements/tokens to the sheet. See the implementation
plan for the phased roadmap and verification strategy.
