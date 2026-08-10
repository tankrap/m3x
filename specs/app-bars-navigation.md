# Top app bar / Navigation rail / Menu / List / Tooltip / Bottom sheet — spec sheet

Sources:
- https://m3.material.io/components/app-bars/specs (Expressive update: search app bar, small/medium-flexible/large-flexible)
- https://m3.material.io/components/navigation-rail/specs (Expressive collapsible)
- https://m3.material.io/components/menus/specs (Expressive container redesign)
- https://m3.material.io/components/lists/specs
- https://m3.material.io/components/tooltips/specs
- https://m3.material.io/components/bottom-sheets/specs

## Top app bar
| Size | Height | Title | Alignment |
|---|---|---|---|
| Small | 64dp | `title-large` | leading, beside nav icon |
| Medium | 112dp | `headline-small` (Expressive: emphasized) | bottom-left, 16dp padding |
| Large | 152dp | `headline-medium` (Expressive: emphasized) | bottom-left |
- Container `surface` (on-scroll: `surface-container`); nav icon 24dp; trailing
  icons 24dp, 4dp gaps; 4dp/16dp side paddings.
- Medium/large collapse to small height on scroll (we ship the static tiers +
  an `elevated` on-scroll flag; full collapse choreography deferred).

## Navigation rail (Expressive)
- Width: collapsed 96dp; expanded 220dp (modal or standing).
- Container `surface`; items: icon 24dp in 56×32 pill (active
  `secondary-container` like nav bar) + `label-medium`; expanded items become
  full-width rows (icon + label inline, 56dp height, pill full-round).
- Optional menu button + FAB at top.

## Menu (standalone)
- Container `surface-container`, corner **extra-small→large**: Expressive uses
  larger corners — we ship `large` (16dp) with 8dp padding, elevation level2.
- Item: 48dp min height, padding 12dp, `label-large`, leading/trailing icons
  24dp `on-surface-variant`; hover state layer; disabled 38%.
- Divider support between groups.

## List item
- 1-line 56dp / 2-line 72dp / 3-line 88dp; padding 16dp; leading icon 24dp
  `on-surface-variant` or avatar 40dp; headline `body-large` `on-surface`,
  supporting `body-medium` `on-surface-variant`; trailing text `label-small`.

## Tooltip (plain)
- Container `inverse-surface`, corner **extra-small**, height 24dp, padding 8dp,
  `body-small` `inverse-on-surface`. Appears on hover (500ms delay) / focus,
  4dp offset from anchor.

## Bottom sheet (modal)
- Container `surface-container-low`, top corners **extra-large (28dp)**,
  drag handle 32×4dp `on-surface-variant` @40% centered 22dp from top,
  scrim 32%. Enter: slide-up emphasized-decelerate.
