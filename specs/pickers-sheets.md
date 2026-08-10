# Date picker / Time picker / Side sheet — spec sheet

Sources:
- https://m3.material.io/components/date-pickers/specs
- https://m3.material.io/components/time-pickers/specs
- https://m3.material.io/components/side-sheets/specs

## Date picker (docked)
- Container `surface-container-high`, corner **large (16dp)**, elevation 3,
  width 360dp; padding 16dp/12dp.
- Header row: month+year `title-small`… we use label-large emphasized, with
  prev/next chevron standard icon buttons.
- Weekday row `body-small` `on-surface-variant`; day cells 40×40dp, corner full.
- Today: 1dp `primary` outline, `primary` text. Selected: `primary` container,
  `on-primary` text. Days outside month hidden (empty cells).
- Modal/full-screen variants + range selection deferred.

## Time picker (input variant)
- Two 2-digit fields 96×72dp?, we use 96×72: `surface-container-highest`,
  corner **small (8dp)**, `display-medium`-ish digits centered; focused/active:
  `primary-container` bg + 2dp `primary` border.
- ":" separator `display-large` `on-surface`.
- Period selector (12h): vertical pair 52×72dp, 1dp `outline` border, corner
  small; selected `tertiary-container` / `on-tertiary-container`.
- Labels under fields: `body-small` `on-surface-variant` ("Hour", "Minute").
- Dial variant deferred.

## Side sheet
- Standing: in-flow panel width 400dp (min 256), `surface`, 1dp
  `outline-variant` divider on the leading edge; header 64dp with `title-large`
  + close icon button; 24dp content padding.
- Modal: native <dialog>, docked to trailing edge, full height, scrim 32%,
  corners **extra-large on the leading edge**, slide-in emphasized-decelerate.
