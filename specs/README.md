# Component spec sheets

One markdown sheet per component, extracted from m3.material.io (anatomy, dp measurements,
token tables, states, motion notes). These sheets are the source of truth for implementation
PRs — every measurement in code must be traceable to a sheet line.

**Spec snapshot date: 2026-08-09.** Values were extracted from the M3 Expressive spec
(m3.material.io component pages, `material-components-android` token docs, Compose
`material3` ≥ 1.4 source). The site is JS-rendered and guidance still evolves —
schedule periodic re-audits against the live site and bump this date when re-verified.

**Audits:** see [AUDIT.md](AUDIT.md) for live-site reconciliation results (buttons,
icon buttons, FAB audited 2026-08-09; five discrepancies found and fixed same day).

**Shape morphing status:** the library now uses corner-aligned morphing (corners
matched between shapes, per-segment arc-length resampling) — the essential behavior
of androidx.graphics.shapes' feature mapping. A line-for-line port of the androidx
cubic Morph machinery (for exact intermediate-frame parity with Compose) remains a
tracked follow-up.

## Sheets

- [button.md](button.md) — common button (5 color styles × 5 sizes × round/square + press morph)
- [icon-button.md](icon-button.md)
- [fab.md](fab.md) — FAB + extended FAB
- [motion.md](motion.md) — motion-physics spring tokens (spatial/effects × default/fast/slow)
