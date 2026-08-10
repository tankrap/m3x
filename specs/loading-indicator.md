# Loading Indicator — spec sheet (new Expressive component)

Sources:
- https://m3.material.io/components/loading-indicator/specs
- Compose `material3` `LoadingIndicator` / `ContainedLoadingIndicator`

## Behavior
Indeterminate indicator that **cycles through shape-library forms**, morphing
from one to the next while rotating continuously. Replaces most indeterminate
circular-progress uses (pull-to-refresh, short waits < 5s).

Shape sequence (Compose default): soft-burst → cookie-9 → pentagon → pill →
sunny → cookie-4 → oval → repeat.

## Measurements
- Uncontained: 38dp active indicator inside a 48dp touch/layout box.
- Contained: 48dp container (corner full), indicator 38dp.

## Colors — AUDITED 2026-08-09 vs live site
- Uncontained: indicator `primary`.
- Contained: container `primary-container`, indicator `on-primary-container`.

## Motion
- Morph: one shape → next with `spatial.slow` spring (overshoot visible),
  every ~650ms.
- Rotation: continuous, ~4.4s per full turn (linear), independent of morphs.
- Reduced motion: no rotation/morph; gentle opacity pulse of a fixed shape
  (effects.slow equivalent).

## A11y
`role="progressbar"` without value (indeterminate) + aria-label.
