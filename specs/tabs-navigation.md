# Tabs / Navigation bar — spec sheet

Sources:
- https://m3.material.io/components/tabs/specs
- https://m3.material.io/components/navigation-bar/specs (Expressive update)

## Primary tabs
- Container height 48dp (64dp with icon+label), background inherits, bottom
  divider 1dp `outline-variant`.
- Tab: `label-large`; active `primary`, inactive `on-surface-variant`;
  state layers on hover/press.
- **Active indicator: 3dp tall, full-rounded top corners, width of the tab's
  content**, sitting on the container bottom edge. Position + width spring with
  `motion.spatial.default` between tabs.
- A11y: `tablist`/`tab`/`aria-selected`; Left/Right arrow roving focus.

## Navigation bar
- Container height 80dp, `surface-container`; 3–5 items, equal widths.
- Item: icon 24dp above `label-medium`; 4dp gap.
  - Active: icon inside a **64×32dp pill** `secondary-container`, icon
    `on-secondary-container` (filled), label `on-surface`.
  - Inactive: icon/label `on-surface-variant`.
- Pill animates in: width grows from 32→64 + fade (`spatial.default`).
- Badges (dot/count) pin to the icon's top-right.
- A11y: nav landmark; items are buttons with `aria-current="page"` when active.
