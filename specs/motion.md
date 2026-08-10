# Motion physics — spec sheet

Sources:
- https://m3.material.io/styles/motion/overview (Expressive motion-physics update)
- Compose `material3` `MotionScheme` (`MotionScheme.expressive()` / `MotionScheme.standard()`)

M3 Expressive replaces duration+easing pairs with **spring parameters** in two families:
- **Spatial** — anything that moves/resizes/morphs (may overshoot; damping < 1)
- **Effects** — color, opacity, elevation (never overshoots; damping = 1)

Each family has three speeds: `default`, `fast` (small/frequent interactions), `slow` (large/expansive).

## Spring tokens (dampingRatio / stiffness), from Compose material3 MotionScheme

### Expressive scheme
| Token | Damping ratio | Stiffness |
|---|---|---|
| spatial.default | 0.8 | 380 |
| spatial.fast | 0.6 | 800 |
| spatial.slow | 0.8 | 200 |
| effects.default | 1.0 | 1600 |
| effects.fast | 1.0 | 3800 |
| effects.slow | 1.0 | 800 |

### Standard scheme (also the reduced-motion fallback for spatial overshoot)
| Token | Damping ratio | Stiffness |
|---|---|---|
| spatial.default | 0.9 | 700 |
| spatial.fast | 0.9 | 1400 |
| spatial.slow | 0.9 | 300 |
| effects.default | 1.0 | 1600 |
| effects.fast | 1.0 | 3800 |
| effects.slow | 1.0 | 800 |

Mass = 1 in all cases. Units match Compose (stiffness in 1/s², critically damped at ratio 1).

## Legacy easing/duration tokens (kept for the "standard" scheme + CSS-only transitions)
- `standard` cubic-bezier(0.2, 0, 0, 1) — durations short1–4 (50–200ms), medium1–4 (250–400ms)
- `standard-decelerate` (0, 0, 0, 1) / `standard-accelerate` (0.3, 0, 1, 1)
- `emphasized-decelerate` (0.05, 0.7, 0.1, 1) — long durations 450–600ms
- `emphasized-accelerate` (0.3, 0, 0.8, 0.15)

## Reduced motion
`prefers-reduced-motion: reduce` → spatial springs resolve instantly (no morph/overshoot);
effects springs remain (color/opacity fades are allowed) but capped ≤ 200ms-equivalent.
Per-component fallbacks are documented in each component sheet.
