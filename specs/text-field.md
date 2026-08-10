# Text Field — spec sheet

Sources:
- https://m3.material.io/components/text-fields/specs

## Filled
- Container height 56dp, corners **extra-small top** (4dp 4dp 0 0),
  background `surface-container-highest`.
- Active indicator (bottom line): 1dp `on-surface-variant`; focused **2dp `primary`**;
  error `error`; hover 1dp `on-surface`.
- Label: resting `body-large` centered (or top-aligned 8dp when floating);
  floating `body-small` at top 8dp. Color: `on-surface-variant`, focused
  `primary`, error `error`.
- Input text `body-large` `on-surface`; caret `primary`.
- Padding 16dp; with leading icon (24dp `on-surface-variant`): 12dp before icon,
  16dp gap to text. Trailing icon 24dp (error state: `error`).

## Outlined
- Container 56dp, corner **extra-small (4dp)**, outline 1dp `outline`;
  focused **2dp `primary`**; error `error`; hover `on-surface`.
- Label floats into a **notch** cut from the outline (top border gap), body-small.

## Supporting text
Below the container: `body-small` `on-surface-variant` (error: `error`), 4dp top
padding, 16dp side padding. Optional trailing counter.

## Motion
Label float + notch: effects.default-equivalent CSS transition
(~150ms standard easing). Indicator thickness change: effects.fast.

## A11y
Real `<label>` bound to the input; supporting text via `aria-describedby`;
`aria-invalid` on error. Prefix/suffix text supported.
