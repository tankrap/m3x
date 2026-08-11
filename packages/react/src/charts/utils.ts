/** Shared chart helpers — pure geometry, no deps. */

export interface Pt {
  x: number;
  y: number;
}

/** angle in degrees, 0 = 12 o'clock, clockwise */
export function polar(cx: number, cy: number, r: number, angleDeg: number): Pt {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** degrees consumed by one round line-cap at radius r (stroke bleed) */
export function capDegrees(thickness: number, r: number): number {
  return ((thickness / 2) / r) * (180 / Math.PI);
}

/**
 * Arc path inset by the round-cap bleed on both ends, so adjacent capped arcs
 * show a true visual gap instead of overlapping. Slices too small to survive
 * the inset keep a minimum drawn arc (rendering as a rounded dot/stub) instead
 * of degenerating into a sliver.
 */
export function cappedArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  thickness: number,
): string {
  const cap = capDegrees(thickness, r);
  const MIN_DRAWN = Math.max(4, cap * 0.75);
  const usable = endDeg - startDeg - 2 * cap;
  if (usable < MIN_DRAWN) {
    const mid = (startDeg + endDeg) / 2;
    return arcPath(cx, cy, r, mid - MIN_DRAWN / 2, mid + MIN_DRAWN / 2);
  }
  return arcPath(cx, cy, r, startDeg + cap, endDeg - cap);
}

/** open arc path between two clock angles (for stroked arcs) */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/** Catmull-Rom → cubic Bézier smooth path through points */
export function smoothPath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  if (pts.length < 3) {
    return `M ${pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')}`;
  }
  let d = `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function linePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  return `M ${pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')}`;
}

/** "nice number" axis ticks covering [0 | min, max] */
export function niceTicks(maxValue: number, count = 4): number[] {
  if (maxValue <= 0) return [0, 1];
  const rough = maxValue / count;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / mag;
  const niceStep = (norm >= 7 ? 10 : norm >= 3 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const ticks: number[] = [];
  for (let v = 0; v <= maxValue + 1e-9; v += niceStep) ticks.push(Math.round(v * 1e6) / 1e6);
  if (ticks[ticks.length - 1]! < maxValue) ticks.push(ticks[ticks.length - 1]! + niceStep);
  return ticks;
}

/**
 * Validated categorical palette generated per-theme (--m3x-chart-1..6): fixed
 * assignment order, CVD-checked, and distinct from the status roles. Per the
 * dataviz rules a 7th series should fold into "Other" rather than get a new
 * hue — the modulo is a rendering fallback, not an invitation.
 */
export const SERIES_SLOTS = 6;

export function seriesColor(i: number): string {
  return `var(--m3x-chart-${(i % SERIES_SLOTS) + 1})`;
}

export const fmt = (v: number): string =>
  Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}k` : `${Math.round(v * 100) / 100}`;
