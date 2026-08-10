# Chips — spec sheet

Sources:
- https://m3.material.io/components/chips/specs

## Common
- Container height 32dp, corner **small (8dp)**, outline 1dp `outline-variant`
  (elevated variant swaps outline for surface-container-low + level1 — deferred).
- Label `label-large` `on-surface-variant` (assist/suggestion) or `on-surface`
  (filter/input); padding 16dp text-only; 8dp on the icon side with 8dp gap.
- Leading icon 18dp (`primary` for assist).
- States: hover/focus/press state layers on the label color; disabled standard.

## Types
| Type | Extras |
|---|---|
| Assist | leading icon optional, acts as button |
| Filter | toggle; selected: container `secondary-container`, label `on-secondary-container`, leading **check** replaces icon, no outline |
| Input | trailing remove icon (18dp) with its own tap handling |
| Suggestion | plain label |

Selection change animates container color (effects.fast); check icon pops in
(spatial.fast scale).
