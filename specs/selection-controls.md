# Checkbox / Radio / Switch — spec sheet

Sources:
- https://m3.material.io/components/checkbox/specs
- https://m3.material.io/components/radio-button/specs
- https://m3.material.io/components/switch/specs

## Checkbox
- Container 18×18dp, corner 2dp, outline 2dp `on-surface-variant`.
- Selected: fill `primary`, checkmark `on-primary` (draw-in animation, effects.default).
- Indeterminate: fill `primary`, 2dp dash.
- Error: outline/fill `error`, check `on-error`.
- Touch target 48dp; 40dp state-layer circle (hover 8% `on-surface` unselected /
  `primary` selected; press ripple `primary`).
- Disabled: outline/fill `on-surface` @38%, no fill tint.

## Radio button
- Outer ring 20dp, 2dp stroke `on-surface-variant`; selected ring `primary` +
  10dp inner dot `primary` (dot scales in with spatial.fast).
- Same 48dp target / 40dp state layer / disabled treatment as checkbox.

## Switch
- Track 52×32dp, corner full.
  - Unselected: `surface-container-highest` + 2dp `outline` border.
  - Selected: `primary`, no border.
- Thumb (springs: position spatial.default, size spatial.fast):
  - Unselected, no icon: 16dp `outline`; with icon 24dp.
  - Selected: 24dp `on-primary`, icon `on-primary-container`… icon colors:
    unselected icon `surface-container-highest`, selected icon `on-primary-container`.
  - Pressed (either state): 28dp.
  - Thumb center x: unselected 16dp, selected 36dp.
- Icons (optional): 16dp, check when selected / close when unselected.
- State layer 40dp on thumb; disabled: track `surface-container-highest` @12%…
  use standard disabled opacities.
