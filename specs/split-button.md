# Split Button — spec sheet (new Expressive component)

Sources:
- https://m3.material.io/components/split-button/specs
- Compose `material3` `SplitButtonLayout`

## Anatomy
Leading button (action, label+optional icon) + trailing button (menu, chevron
icon) separated by a 2dp gap. Both share the connected silhouette: outer edges
full, **inner edges small (8dp; 12dp for L/XL)**.

## Sizes & colors
Same 5 sizes and 5 color styles as the common button (specs/button.md); trailing
button is icon-only, width ≈ height×0.75…1 (we use square = height width with
the connected inner corners). Trailing chevron icon sizes match button icon sizes.

## Trailing activation (signature interaction)
Opening the menu:
- trailing container **morphs to fully rounded** (`spatial.default`)
- chevron **rotates 180°** (`spatial.default`, springy overshoot)
- trailing shows selected colors while open (filled: unchanged; tonal example:
  container stays, state layer pressed)
Closing reverses both.

## A11y
Trailing: `aria-haspopup="menu"`, `aria-expanded`; menu `role="menu"` with
`role="menuitem"` children; Escape and outside-click close; focus returns to
trailing button on close.
