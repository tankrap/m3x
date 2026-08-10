# Common Button — spec sheet

Sources:
- https://m3.material.io/components/buttons/specs (Expressive update)
- https://m3.material.io/components/buttons/guidelines
- material-components-android `Button.md` token tables; Compose `material3` ButtonDefaults/ButtonShapes

## Anatomy
1. Container  2. Label text  3. Optional leading icon  4. State layer  5. Focus indicator

## Color styles (5)
| Style | Container | Label/icon | Elevation | Notes |
|---|---|---|---|---|
| Elevated | `surface-container-low` | `primary` | level1 (hover level2) | shadow color `shadow` |
| Filled | `primary` | `on-primary` | level0 (hover level1) | |
| Tonal | `secondary-container` | `on-secondary-container` | level0 (hover level1) | |
| Outlined | transparent, outline 1dp `outline-variant` | `on-surface-variant`* | level0 | *Expressive spec: label `on-surface-variant` |
| Text | transparent | `primary` | level0 | horizontal padding differs |

Disabled (all styles): container `on-surface` @ 10%, label/icon `on-surface` @ 38%,
outline `on-surface` @ 10% (outlined), elevation level0.

## Sizes (Expressive: 5 sizes)
| Size | Height | Label typescale | Icon | H padding | Icon–label gap | Outline |
|---|---|---|---|---|---|---|
| XS | 32dp | label-large | 20dp | 12dp | 8dp | 1dp |
| S (default) | 40dp | label-large | 20dp | 16dp | 8dp | 1dp |
| M | 56dp | title-medium | 24dp | 24dp | 8dp | 1dp |
| L | 96dp | headline-small | 32dp | 48dp | 12dp | 2dp |
| XL | 136dp | headline-large | 40dp | 64dp | 16dp | 3dp |

Text buttons use reduced horizontal padding: XS/S 12dp, M 16dp, L 32dp, XL 48dp.
Touch target: minimum 48×48dp (XS/S get invisible touch-target extension).

## Shape (round ↔ square) + press morph — AUDITED 2026-08-09 vs live site
| Size | Round | Square | Pressed state |
|---|---|---|---|
| XS | full | 12dp | **8dp** |
| S | full | 12dp | **8dp** |
| M | full | 16dp | **12dp** |
| L | full | 28dp | **16dp** |
| XL | full | 28dp | **16dp** |

- "full" = fully rounded (height/2).
- **Press morph (signature Expressive interaction):** on press, corner radius springs to
  the dedicated pressed-state value — *both round and square buttons share the same
  pressed shape* (live spec: "Both round and square buttons should have the same
  pressed shape"). On release it springs back.
  Spring: `motion.spatial.fast`. Reduced motion: no morph (instant state colors only).

## Toggle buttons — colors AUDITED 2026-08-09 vs live site
- `aria-pressed`; unselected shape round, **selected shape square** (or the opposite if
  resting shape is square) — selection change animates shape with `motion.spatial.default`.
- No toggle for the text style.

| Style | Unselected | Selected |
|---|---|---|
| Elevated | `surface-container-low` / `primary` | `primary` / `on-primary` |
| Filled | `surface-container` / `on-surface-variant` | `primary` / `on-primary` |
| Tonal | `secondary-container` / `on-secondary-container` | `secondary` / `on-secondary` |
| Outlined | outline + `on-surface-variant` | `inverse-surface` / `inverse-on-surface` |

## States & state layers
hover 8%, focus 10%, press 10% (pressed state layer color = label color). Ripple on press.
Focus indicator: 3dp `secondary` ring, 2dp offset outside the container, follows container shape.

## Motion
- Press morph: spatial.fast spring on corner-radius.
- Color/elevation transitions: effects.fast.
