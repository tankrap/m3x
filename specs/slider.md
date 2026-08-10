# Slider — spec sheet (Expressive update)

Sources:
- https://m3.material.io/components/sliders/specs
- Compose `material3` Slider (≥1.4 Expressive visuals)

## Anatomy (Expressive)
- **Track 16dp tall**, corner full. Active `primary`, inactive `secondary-container`.
- **Handle: 4dp wide × 44dp tall** pill (`primary`), with **6dp gap** between the
  handle and both track segments (track ends are inset-rounded toward the handle).
- **Stop indicator**: 4dp dot `on-secondary-container` at the inactive track end
  (and tick dots for stepped sliders).
- Pressed: handle narrows to 2dp; value label appears above
  (`inverse-surface` container, `inverse-on-surface` label-medium… we use a
  full-round pill).
- Disabled: standard disabled opacities.

## Sizes
XS 16dp track (default) — larger M/L/XL track variants (24/40/96) deferred.

## Motion
Handle position follows pointer directly (no lag); on release/keyboard step the
position animates with `spatial.fast`. Handle width press morph `spatial.fast`.

## A11y
Built over a native `<input type="range">` (invisible, full-size) so keyboard,
screen reader and form semantics come from the platform. Value label announced
via the native element's value.

## Variants
Single value (Phase 3), range + centered deferred.
