/**
 * M3 shape system: corner radius tokens + the Expressive decorative shape library
 * with morph support.
 *
 * Spec: https://m3.material.io/styles/shape/overview
 *
 * The shape library is generated from rounded-polygon parameters, following the
 * model of androidx.graphics.shapes (Apache-2.0). Morphing here normalizes every
 * shape to a fixed-count point outline sampled by arc length, so any shape can
 * spring-morph into any other. NOTE (specs/README): exact intermediate frames of
 * Compose's `MaterialShapes` morph may differ; a faithful port of the androidx
 * polygon-morph algorithm is tracked as a follow-up.
 */

/** md.sys.shape.corner.* in px. `full` is resolved per-component as height/2. */
export const cornerTokens = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  largeIncreased: 20,
  extraLarge: 28,
  extraLargeIncreased: 32,
  extraExtraLarge: 48,
  /** fully rounded — use 999px in CSS, or height/2 when animating */
  full: 999,
} as const;

export type CornerToken = keyof typeof cornerTokens;

// ---------------------------------------------------------------------------
// Rounded polygon generator
// ---------------------------------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

export interface RoundedPolygonSpec {
  /** number of outer vertices (lobes for stars) */
  vertices: number;
  /** 0–1: inner radius ratio for star polygons; omit for convex polygons */
  innerRadius?: number;
  /** 0–1: corner rounding as fraction of the max round-able distance (outer vertices) */
  rounding?: number;
  /** 0–1: rounding for inner (star) vertices; defaults to `rounding` */
  innerRounding?: number;
  /** per-vertex rounding override, length must equal total vertex count */
  perVertexRounding?: number[];
  /** rotation in degrees; 0 puts the first vertex at 12 o'clock */
  rotation?: number;
  /** y scale for ovals/semicircles */
  scaleY?: number;
}

const TAU = Math.PI * 2;

/** Raw (unrounded) vertex ring in unit space, first vertex at 12 o'clock. */
function polygonVertices(spec: RoundedPolygonSpec): Point[] {
  const { vertices, innerRadius, rotation = 0 } = spec;
  const pts: Point[] = [];
  const total = innerRadius != null ? vertices * 2 : vertices;
  for (let i = 0; i < total; i++) {
    const r = innerRadius != null && i % 2 === 1 ? innerRadius : 1;
    const angle = -Math.PI / 2 + (rotation * Math.PI) / 180 + (i / total) * TAU;
    pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }
  return pts;
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

interface RawOutline {
  /** dense flattened outline */
  pts: Point[];
  /** for each polygon vertex, the raw index of its corner-center point */
  cornerCenters: number[];
}

function buildRawOutline(spec: RoundedPolygonSpec): RawOutline {
  const verts = polygonVertices(spec);
  const n = verts.length;
  const raw: Point[] = [];
  const cornerCenters: number[] = [];
  const CORNER_STEPS = 8;

  for (let i = 0; i < n; i++) {
    const prev = verts[(i - 1 + n) % n]!;
    const v = verts[i]!;
    const next = verts[(i + 1) % n]!;
    const isInner = spec.innerRadius != null && i % 2 === 1;
    const base = spec.perVertexRounding?.[i] ?? (isInner ? spec.innerRounding ?? spec.rounding ?? 0 : spec.rounding ?? 0);
    // cut distance limited to half of the shorter adjacent edge
    const cut = Math.min(dist(prev, v), dist(v, next)) * 0.5 * Math.min(Math.max(base, 0), 1);
    if (cut <= 1e-6) {
      cornerCenters.push(raw.length);
      raw.push(v);
      continue;
    }
    const pIn = lerpPoint(v, prev, cut / dist(prev, v));
    const pOut = lerpPoint(v, next, cut / dist(v, next));
    cornerCenters.push(raw.length + CORNER_STEPS / 2);
    for (let sIdx = 0; sIdx <= CORNER_STEPS; sIdx++) {
      const t = sIdx / CORNER_STEPS;
      // quadratic bezier pIn → v → pOut
      const a = lerpPoint(pIn, v, t);
      const b = lerpPoint(v, pOut, t);
      raw.push(lerpPoint(a, b, t));
    }
  }

  // apply oval scaling
  const pts = spec.scaleY != null ? raw.map((p) => ({ x: p.x, y: p.y * spec.scaleY! })) : raw;
  return { pts, cornerCenters };
}

function cumulativeLengths(pts: Point[]): number[] {
  const lens: number[] = [0];
  for (let i = 1; i <= pts.length; i++) {
    lens.push(lens[i - 1]! + dist(pts[i - 1]!, pts[i % pts.length]!));
  }
  return lens;
}

/** interpolated point at arc-length progress p ∈ [0,1) of a closed outline */
function pointAtProgress(pts: Point[], lens: number[], p: number): Point {
  const total = lens[pts.length]!;
  const target = ((p % 1) + 1) % 1 * total;
  let lo = 0;
  let hi = pts.length;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (lens[mid]! <= target) lo = mid;
    else hi = mid;
  }
  const segLen = lens[lo + 1]! - lens[lo]! || 1e-9;
  return lerpPoint(pts[lo]!, pts[(lo + 1) % pts.length]!, (target - lens[lo]!) / segLen);
}

/**
 * Build the outline as a dense point list: each corner is rounded with a
 * quadratic Bézier (control point at the raw vertex), flattened to line
 * segments, then the whole outline is resampled uniformly by arc length.
 */
export function outlinePoints(spec: RoundedPolygonSpec, samples = 120): Point[] {
  const { pts } = buildRawOutline(spec);
  const lens = cumulativeLengths(pts);
  const out: Point[] = [];
  for (let i = 0; i < samples; i++) out.push(pointAtProgress(pts, lens, i / samples));
  return out;
}

/** arc-length progress (0..1) of each polygon corner center */
export function cornerProgresses(spec: RoundedPolygonSpec): number[] {
  const { pts, cornerCenters } = buildRawOutline(spec);
  const lens = cumulativeLengths(pts);
  const total = lens[pts.length]!;
  return cornerCenters.map((idx) => lens[Math.min(idx, pts.length - 1)]! / total);
}

// ---------------------------------------------------------------------------
// Shape library (subset of the 35-shape Expressive library; geometry
// approximated from the Figma M3 kit — see file header note)
// ---------------------------------------------------------------------------

export const shapeLibrary = {
  circle: { vertices: 12, rounding: 1 },
  square: { vertices: 4, rounding: 0.3, rotation: 45 },
  slanted: { vertices: 4, rounding: 0.5, rotation: 60 },
  oval: { vertices: 12, rounding: 1, scaleY: 0.64, rotation: -20 },
  pill: { vertices: 4, rounding: 1, rotation: 45, scaleY: 0.55 },
  triangle: { vertices: 3, rounding: 0.25 },
  diamond: { vertices: 4, rounding: 0.3 },
  pentagon: { vertices: 5, rounding: 0.3 },
  gem: { vertices: 6, rounding: 0.35, rotation: 30 },
  sunny: { vertices: 8, innerRadius: 0.8, rounding: 0.7, innerRounding: 0.5 },
  verySunny: { vertices: 8, innerRadius: 0.65, rounding: 0.6, innerRounding: 0.4 },
  cookie4: { vertices: 4, innerRadius: 0.5, rounding: 1, innerRounding: 0.6 },
  cookie6: { vertices: 6, innerRadius: 0.75, rounding: 1, innerRounding: 0.5 },
  cookie7: { vertices: 7, innerRadius: 0.75, rounding: 1, innerRounding: 0.5 },
  cookie9: { vertices: 9, innerRadius: 0.8, rounding: 1, innerRounding: 0.5 },
  cookie12: { vertices: 12, innerRadius: 0.8, rounding: 1, innerRounding: 0.5 },
  clover4: { vertices: 4, innerRadius: 0.2, rounding: 1, innerRounding: 0.9, rotation: 45 },
  clover8: { vertices: 8, innerRadius: 0.45, rounding: 1, innerRounding: 0.9 },
  burst: { vertices: 12, innerRadius: 0.7, rounding: 0 },
  softBurst: { vertices: 10, innerRadius: 0.65, rounding: 0.4, innerRounding: 0.2 },
  boom: { vertices: 15, innerRadius: 0.42, rounding: 0 },
  softBoom: { vertices: 16, innerRadius: 0.55, rounding: 0.3, innerRounding: 0.1 },
  flower: { vertices: 8, innerRadius: 0.6, rounding: 1, innerRounding: 0.1 },
  puffy: { vertices: 10, innerRadius: 0.5, rounding: 1, innerRounding: 0.3 },
  puffyDiamond: { vertices: 4, innerRadius: 0.4, rounding: 0.9, innerRounding: 0.2 },
  arch: { vertices: 4, perVertexRounding: [1, 1, 0.2, 0.2], rotation: 45 },
  semicircle: { vertices: 4, perVertexRounding: [1, 1, 0.15, 0.15], rotation: 45, scaleY: 0.8 },
  fan: { vertices: 4, perVertexRounding: [1, 0.15, 0.15, 0.15], rotation: 45 },
} as const satisfies Record<string, RoundedPolygonSpec>;

export type ShapeName = keyof typeof shapeLibrary;
export const SHAPE_NAMES = Object.keys(shapeLibrary) as ShapeName[];

/** Shared sample count — every library shape resolves to this many outline points. */
export const SHAPE_SAMPLES = 144;

const outlineCache = new Map<string, Point[]>();

export function shapeOutline(name: ShapeName): Point[] {
  let pts = outlineCache.get(name);
  if (!pts) {
    pts = outlinePoints(shapeLibrary[name], SHAPE_SAMPLES);
    outlineCache.set(name, pts);
  }
  return pts;
}

/** Map unit-space points into an SVG path for a size×size viewport. */
export function pointsToSvgPath(points: Point[], size: number): string {
  const half = size / 2;
  const f = (v: number) => +(half + v * half * 0.98).toFixed(2);
  let d = `M${f(points[0]!.x)} ${f(points[0]!.y)}`;
  for (let i = 1; i < points.length; i++) d += `L${f(points[i]!.x)} ${f(points[i]!.y)}`;
  return d + 'Z';
}

/** SVG path for a library shape. */
export function shapePath(name: ShapeName, size = 48): string {
  return pointsToSvgPath(shapeOutline(name), size);
}

/** Interpolated path between two shapes, t ∈ [0,1] (can overshoot slightly for springs). */
export function morphPath(from: ShapeName, to: ShapeName, t: number, size = 48): string {
  const a = shapeOutline(from);
  const b = shapeOutline(to);
  const pts = a.map((p, i) => lerpPoint(p, b[i]!, t));
  return pointsToSvgPath(pts, size);
}

// ---------------------------------------------------------------------------
// Corner-aligned morphing
//
// Inspired by androidx.graphics.shapes' feature mapping (Apache-2.0): instead
// of lerping uniformly-resampled points (which lets corners drift through
// edges), corners of shape A are matched to corners of shape B (best circular
// offset, evenly distributed when counts differ) and both outlines are
// resampled so matched corners share sample indices. Not a line-for-line port
// of the androidx Morph cubic machinery — tracked in specs/README.md.
// ---------------------------------------------------------------------------

export interface AlignedMorph {
  from: Point[];
  to: Point[];
}

const circDist = (a: number, b: number) => {
  const d = Math.abs(a - b) % 1;
  return Math.min(d, 1 - d);
};

function alignCorners(pA: number[], pB: number[]): Array<[number, number]> {
  // ensure A is the smaller set
  const swap = pA.length > pB.length;
  const small = swap ? pB : pA;
  const large = swap ? pA : pB;
  const k = small.length;
  const m = large.length;

  let best: Array<[number, number]> = [];
  let bestCost = Infinity;
  for (let o = 0; o < m; o++) {
    // evenly distribute small's corners over large's, starting at offset o
    const pairs: Array<[number, number]> = [];
    let cost = 0;
    for (let i = 0; i < k; i++) {
      const j = (Math.round((i * m) / k) + o) % m;
      pairs.push([small[i]!, large[j]!]);
      cost += circDist(small[i]!, large[j]!);
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = pairs;
    }
  }
  return best.map(([s, l]) => (swap ? [l, s] : [s, l]) as [number, number]);
}

/**
 * Resample two shapes into equal-length point lists whose matched corners sit
 * at identical indices, so lerping between them morphs corner→corner.
 */
export function alignedOutlines(
  a: RoundedPolygonSpec,
  b: RoundedPolygonSpec,
  samples = SHAPE_SAMPLES,
): AlignedMorph {
  const rawA = buildRawOutline(a);
  const rawB = buildRawOutline(b);
  const lensA = cumulativeLengths(rawA.pts);
  const lensB = cumulativeLengths(rawB.pts);
  const progA = cornerProgresses(a);
  const progB = cornerProgresses(b);

  const pairs = alignCorners(progA, progB).sort((x, y) => x[0] - y[0]);
  const n = pairs.length;
  if (n === 0) {
    return { from: outlinePoints(a, samples), to: outlinePoints(b, samples) };
  }

  // allocate samples per inter-corner segment, proportional to average span
  const spans: number[] = [];
  for (let i = 0; i < n; i++) {
    const [a0, b0] = pairs[i]!;
    const [a1, b1] = pairs[(i + 1) % n]!;
    const dA = ((a1 - a0) % 1 + 1) % 1 || (n === 1 ? 1 : 0);
    const dB = ((b1 - b0) % 1 + 1) % 1 || (n === 1 ? 1 : 0);
    spans.push((dA + dB) / 2);
  }
  const totalSpan = spans.reduce((s, v) => s + v, 0) || 1;
  const counts = spans.map((s) => Math.max(1, Math.round((s / totalSpan) * samples)));

  const from: Point[] = [];
  const to: Point[] = [];
  for (let i = 0; i < n; i++) {
    const [a0, b0] = pairs[i]!;
    const [a1, b1] = pairs[(i + 1) % n]!;
    const dA = ((a1 - a0) % 1 + 1) % 1 || 1;
    const dB = ((b1 - b0) % 1 + 1) % 1 || 1;
    const c = counts[i]!;
    for (let s = 0; s < c; s++) {
      const t = s / c;
      from.push(pointAtProgress(rawA.pts, lensA, a0 + dA * t));
      to.push(pointAtProgress(rawB.pts, lensB, b0 + dB * t));
    }
  }
  return { from, to };
}

const alignedCache = new Map<string, AlignedMorph>();

/** Cached corner-aligned morph between two library shapes. */
export function alignedShapeMorph(from: ShapeName, to: ShapeName): AlignedMorph {
  const key = `${from}→${to}`;
  let m = alignedCache.get(key);
  if (!m) {
    m = alignedOutlines(shapeLibrary[from], shapeLibrary[to]);
    alignedCache.set(key, m);
  }
  return m;
}
