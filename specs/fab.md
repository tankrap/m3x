# FAB / Extended FAB — spec sheet

Sources:
- https://m3.material.io/components/floating-action-button/specs (Expressive update)
- https://m3.material.io/components/extended-fab/specs

## FAB sizes (Expressive: baseline / medium / large)
| Size | Container | Icon | Corner |
|---|---|---|---|
| Baseline | 56dp | 24dp | 16dp |
| Medium | 80dp | 28dp | 24dp |
| Large | 96dp | 36dp | 28dp |

## Colors
| Option | Container | Icon |
|---|---|---|
| Primary container (default) | `primary-container` | `on-primary-container` |
| Secondary | `secondary-container` | `on-secondary-container` |
| Tertiary | `tertiary-container` | `on-tertiary-container` |
| Primary (Expressive vibrant) | `primary` | `on-primary` |
| Tonal / surface | `surface-container-high` | `primary` |

Elevation: resting level3, hover level4, press level3. (Lowered "flat on scroll" behavior
comes with toolbars, Phase 2.)

## Extended FAB
Same heights/corners/colors; label typescale: baseline `label-large`, medium `title-medium`,
large `title-large`. Padding: baseline 16dp (icon–label gap 8dp), medium 20dp/10dp?, large 28dp/12dp
— TODO re-verify medium/large paddings on live spec at next audit.
Collapse/expand: width morphs with `motion.spatial.default`; label fades with `effects.default`.

## States
State layer color = icon/label color; hover 8% / focus 10% / press 10% + ripple.
Focus ring 3dp `secondary`, 2dp offset.
