# Live-site spec audits

Per plan §6/§9: reconcile spec sheets against the JS-rendered live site.

## 2026-08-09 — buttons, icon buttons, FAB (m3.material.io, in-app browser)

Verified correct as implemented:
- Button/icon-button square corner radii (12/12/16/28/28), round = full.
- Expressive small-button padding 16dp; 5 sizes; 5 color styles; toggle shape flip
  (round↔square) and "if resting shape is square, selected is round".
- Filled toggle unselected `surface-container`/`on-surface-variant`.
- Outlined toggle selected `inverse-surface`/`inverse-on-surface`.
- Standard icon-button toggle selected icon `primary`.
- State layers 8%/10%/10%; XS/S 48dp minimum target.
- FAB hover = elevation 4; state layer color follows icon color role.

Discrepancies found → **fixed in code same day**:
1. **Pressed-state corner is a dedicated third value** (XS/S 8dp, M 12dp, L/XL 16dp),
   shared by round and square shapes — previously we morphed toward "the other
   shape's radius". Fixed in `button/sizes.ts` (`PRESSED_RADIUS`).
2. **Tonal toggle**: unselected stays `secondary-container` (we had `surface-container`);
   selected deepens to `secondary`/`on-secondary` (we had `secondary-container`).
   Fixed in button.css + icon-button.css.
3. **Elevated toggle selected** = `primary`/`on-primary` (we kept surface). Fixed.
4. **Filled icon-button toggle unselected icon** = `on-surface-variant` (we had
   `primary`). Fixed.
5. **FAB color styles renamed/expanded** in Expressive: containers are the named
   defaults (`primaryContainer` etc.) plus new vibrant `primary`/`secondary`/
   `tertiary`; small + surface FABs "no longer recommended". `FabColor` union
   updated; `surface` kept as legacy.

## 2026-08-09 (second pass) — button groups, progress, toolbars, loading indicator

Verified correct as implemented:
- Connected group gap 2dp at all sizes; XS/S minimum width 48dp.
- Progress: colors primary/secondary-container, 4dp default thickness
  (configurable), flat + wavy shapes, stop indicator anatomy, 4dp screen inset.
- Docked toolbar `surface-container`, 64dp, 16dp min outside padding.
- Floating toolbar vibrant = `primary-container` with `on-primary-container`
  standard icon buttons.
- Loading indicator 48dp box / 38dp shape; uncontained indicator `primary`.

Discrepancies found → **fixed in code same day**:
6. **Standard group gaps are size-inverted**: XS 18dp, S 12dp, M/L/XL 8dp
   (we had 8/8/8/12/16). Fixed in ButtonGroup.
7. **Connected inner corner radii**: XS 4, S 8, M 8, L 16, XL 20 (we had
   8/8/8/12/12). Fixed in usePressMorph.
8. **The width bump is standard-group-only** — connected groups change only the
   pressed/selected member's shape. Fixed in ButtonGroup.
9. **Contained loading indicator** = `primary-container`/`on-primary-container`
   (we had secondary). Fixed.
10. **All toolbars default to 64dp height** — floating toolbar got min-height 64.

Not yet audited: split button, FAB menu (token tables are behind interactive
widgets; trailing-button paddings + menu item metrics still from Compose source),
extended FAB paddings, all Phase 3/4 components. Wave amplitude/wavelength for
wavy progress shown only in images — our 3dp/40dp defaults remain unverified.
