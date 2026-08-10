# Cards / Dialog / Snackbar / Badge / Divider — spec sheet

Sources:
- https://m3.material.io/components/cards/specs
- https://m3.material.io/components/dialogs/specs
- https://m3.material.io/components/snackbar/specs
- https://m3.material.io/components/badges/specs
- https://m3.material.io/components/divider/specs

## Cards
Corner **medium (12dp)**; padding is content-owned (16dp typical).
| Variant | Container | Elevation |
|---|---|---|
| Elevated | `surface-container-low` | level1 (hover level2 when interactive) |
| Filled | `surface-container-highest` | level0 (hover level1) |
| Outlined | `surface` + 1dp `outline-variant` | level0 |
Interactive cards get state layer + ripple + focus ring.

## Dialog (basic)
- Container `surface-container-high`, corner **extra-large (28dp)**, elevation
  level3, min width 280dp / max 560dp, padding 24dp.
- Icon (optional) 24dp `secondary` centered; headline `headline-small`
  `on-surface` (centered if icon); supporting `body-medium` `on-surface-variant`;
  actions right-aligned text buttons, 8dp gap, 24dp top spacing.
- Scrim: `scrim` @ 32%.
- Motion: enter emphasized-decelerate 400ms fade+scale(0.9→1)? — we ship
  fade + scale 0.9→1, medium4/emphasized-decelerate; exit fade short2.
- Built on native `<dialog>` (focus trap, Esc, top layer for free).

## Snackbar
- Container `inverse-surface`, corner **extra-small (4dp)**, elevation level3,
  height 48dp (single line), padding-inline 16dp, label `body-medium`
  `inverse-on-surface`; action text button `inverse-primary`; optional close icon.
- Enter: slide-up+fade emphasized-decelerate; auto-dismiss default 5s.

## Badge
- Small: 6dp dot `error`.
- Large: height 16dp, corner full, `error` bg, `on-error` `label-small`, min
  16dp wide, 4dp side padding, max 4 chars ("999+").

## Divider
1dp `outline-variant`; full-width or inset (16dp).
