# Icon Button — spec sheet

Sources:
- https://m3.material.io/components/icon-buttons/specs (Expressive update)
- Compose `material3` IconButtonDefaults / IconToggleButton

## Variants (color styles)
| Style | Container | Icon | Notes |
|---|---|---|---|
| Filled | `primary` | `on-primary` | toggle unselected: container `surface-container`, icon `primary` |
| Tonal | `secondary-container` | `on-secondary-container` | toggle unselected: container `surface-container`, icon `on-surface-variant` |
| Outlined | transparent + 1dp `outline-variant` | `on-surface-variant` | toggle selected: container `inverse-surface`, icon `inverse-on-surface` |
| Standard | none | `on-surface-variant` | toggle selected icon `primary` |

Disabled: container `on-surface` @10%, icon `on-surface` @38%.

## Sizes (Expressive: 5) — default width
| Size | Container | Icon | Round | Square |
|---|---|---|---|---|
| XS | 32dp | 20dp | full | 12dp |
| S (default) | 40dp | 24dp | full | 12dp |
| M | 56dp | 24dp | full | 16dp |
| L | 96dp | 32dp | full | 28dp |
| XL | 136dp | 40dp | full | 28dp |

Widths also come in narrow/wide (deferred; default width Phase 1). Touch target min 48dp.

## Shape morph
- Press: same round↔square spring morph as common button (`motion.spatial.fast`).
- Toggle: unselected round → **selected square** with `motion.spatial.default`;
  Material Symbols icon animates FILL 0 → 1 (`effects.default`).

## States
State layers on icon color: hover 8% / focus 10% / press 10% + ripple.
Focus ring 3dp `secondary`, 2dp offset.
