# Progress Indicators — spec sheet (Expressive update)

Sources:
- https://m3.material.io/components/progress-indicators/specs
- Compose `material3` `LinearWavyProgressIndicator` / `CircularWavyProgressIndicator`

## Linear
- Track thickness 4dp (configurable), rounded caps.
- **Active/track gap: 4dp.**
- **Stop indicator: 4dp dot** at the track end (stays visible until 100%).
- Track color `secondary-container`; active `primary`.
- **Wavy option (Expressive):** active indicator is a sine wave — amplitude 3dp
  (configurable), wavelength 40dp, phase animates continuously (~1 wavelength /
  ~850ms, linear). Track stays flat. Wave flattens as progress → 100%.
- Indeterminate: classic two-segment sweep (kept from baseline M3).

## Circular
- Stroke 4dp, gap 4dp between active arc and track arc, rounded caps.
- Default size 48dp (40dp active diameter).
- Wavy option: active arc radius modulated by radial sine (amplitude 2dp,
  ~8 periods), phase animates continuously.
- Indeterminate circular: prefer the Loading Indicator (specs/loading-indicator.md);
  a rotating-arc fallback is provided.

## Reduced motion
Wave phase stops animating (static wave or flat); determinate progress changes
animate with `effects.default` only.

## A11y
`role="progressbar"`, aria-valuemin/max/now for determinate.
