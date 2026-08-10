# Toolbars — spec sheet (new Expressive component)

Sources:
- https://m3.material.io/components/toolbars/specs

Note: the bottom app bar is deprecated in Expressive; the **docked toolbar** is
its replacement.

## Docked toolbar
- Full-width bar docked to the bottom; **height 64dp**; color
  `surface-container`; no corner rounding; content row with 8dp gap, 16dp
  horizontal padding; center or space-between arrangements.
- Typically hosts icon buttons / a button; may pair with a FAB sitting above.

## Floating toolbar
- Free-floating pill: corner **full**, padding 8dp, item gap 4dp,
  **horizontal or vertical** orientation, elevation level2? — we ship level2;
  verify at next audit.
- Color configs: **standard** = container `surface-container`, content
  `on-surface-variant`; **vibrant** = container `primary-container`, content
  `on-primary-container`.
- May pair with an adjacent FAB (8dp gap).

## A11y
`role="toolbar"` + aria-label; arrow-key roving focus deferred to a follow-up.
