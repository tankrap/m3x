# Search bar / Segmented buttons / Navigation drawer / Carousel / Rich tooltip — spec sheet

Sources:
- https://m3.material.io/components/search/specs
- https://m3.material.io/components/segmented-buttons/specs
- https://m3.material.io/components/navigation-drawer/specs
- https://m3.material.io/components/carousel/specs
- https://m3.material.io/components/tooltips/specs (rich)

## Search bar
- Pill container 56dp, corner **full**, `surface-container-high`; leading
  search icon 24dp `on-surface`; input `body-large` `on-surface`
  (placeholder `on-surface-variant`); trailing icon/avatar 24–30dp.
- Docked suggestions: container extends below (corner 28dp), divider under bar,
  list items per list spec. Full-screen search view deferred.

## Segmented buttons
- 1dp `outline` border, height 40dp, ends fully rounded, segments share inner
  1dp borders; label `label-large`.
- Selected: container `secondary-container`, label/check `on-secondary-container`,
  leading **check 18dp** replaces icon.
- Single-select (radio semantics) and multi-select (checkbox semantics).
- Note: visually superseded by connected button groups in Expressive, still in spec.

## Navigation drawer
- Modal: width 360dp, container `surface-container-low`, **28dp corners on the
  trailing edge**, scrim 32%, slides from start (emphasized-decelerate).
- Standing: same sheet, no scrim/animation.
- Item: 56dp row, corner full, padding 16dp/24dp, `label-large`; active:
  container `secondary-container`, icon/label `on-secondary-container`;
  inactive `on-surface-variant`. Optional badge/trailing text. Headline slot
  (`title-small`) for section headers.

## Carousel (multi-browse, v1)
- Horizontally scrolling items, 16dp corner **large (28dp per Expressive
  update — we use 28dp)** rounded corners on every item, 8dp gaps.
- Scroll-snap to item starts; large items = `itemWidth` prop, container masks
  partial items at the edges.
- NOTE: the Compose "keyline" dynamic item-width morphing (large→small as items
  approach edges) is deferred; tracked as follow-up with the androidx port.

## Rich tooltip
- Container `surface-container`, corner **medium (12dp)**, elevation level2,
  max width 320dp, padding 16dp/8dp bottom.
- Subhead `title-small` `on-surface-variant`… (spec: subhead `on-surface-variant`),
  supporting `body-medium` `on-surface-variant`, optional text-button actions
  (`primary`). Persistent (click-away closes) or hover.
