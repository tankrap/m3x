# FAB Menu — spec sheet (new Expressive component)

Sources:
- https://m3.material.io/components/fab-menu/specs
- Compose `material3` `FloatingActionButtonMenu`

## Anatomy
A FAB that morphs open into a vertical stack of **large, high-contrast menu
items** above it (bottom-aligned, expanding upward).

- Closed: any FAB size/color (specs/fab.md).
- Open: FAB becomes a **close affordance** — container switches to `primary`,
  icon rotates (e.g. add → ×, 45°), shape morphs toward full round.
- Items: 56dp-high pills (corner full), `primary-container` /
  `on-primary-container` (high contrast), icon 24dp + label-large, 16dp padding,
  8dp vertical gap, right-aligned to the FAB edge.

## Motion
- Items stagger in bottom-to-top: translateY + scale from the FAB with
  `spatial.default` springs, ~30ms stagger; fade with `effects.default`.
- FAB icon rotation: `spatial.default` (overshoots).
- Reduced motion: items fade in place, no travel/rotation.

## A11y
FAB: `aria-haspopup="menu"`, `aria-expanded`. Items list `role="menu"`,
items `role="menuitem"`. Escape closes and refocuses the FAB.
