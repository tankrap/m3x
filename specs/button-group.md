# Button Group — spec sheet (new Expressive component)

Sources:
- https://m3.material.io/components/button-groups/specs
- Compose `material3` `ButtonGroup` (≥1.4): press "bump" choreography

## Variants — AUDITED 2026-08-09 vs live site
1. **Standard** — row of buttons keeping their own shapes. Inner padding:
   **XS 18dp, S 12dp, M/L/XL 8dp** (bigger gaps for small sizes keep 48dp targets).
2. **Connected** — 2dp gap at every size; outer edges fully rounded, **inner
   corner radii: XS 4dp, S 8dp, M 8dp, L 16dp, XL 20dp**. Selected/pressed
   member becomes fully rounded. XS/S minimum width 48dp.

## The bump (signature interaction) — STANDARD GROUPS ONLY
Live spec: "Connected button groups don't add any interaction between buttons —
they only affect the shape of the button being selected."
In standard groups, pressing a member **widens it by 15% of its width**; the
adjacent neighbor(s) compress by the same total amount (split when there are
two), so overall row width stays constant. Springs: `motion.spatial.fast` while
pressed, released with `spatial.default`. Non-adjacent members don't move.
Reduced motion: no width changes.

## States
Members are regular buttons/toggle buttons (any color style; connected groups
commonly use tonal/filled toggles). All member states per specs/button.md.

## A11y
Container `role="group"` + aria-label. Single-select use cases should use
toggle buttons with aria-pressed (radio semantics deferred to segmented buttons).
