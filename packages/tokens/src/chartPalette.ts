/**
 * Categorical chart palette, derived from the theme seed and validated at
 * generation time ("snap-to-passing").
 *
 * Checks ported from the dataviz palette validator: OKLab lightness band,
 * chroma floor, adjacent-pair CVD separation (Machado–Oliveira–Fernandes 2009
 * severity-1.0 transforms), normal-vision floor, and WCAG contrast vs the
 * chart surface. Hues are assigned in FIXED order (never cycled) and the
 * palette deliberately excludes the status roles (success/warning/error/info).
 */
import { argbFromHex, Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities';

const ROTATIONS = [0, 150, 60, 300, 110, 240];
const LIGHT_TONES = [40, 58, 42, 60, 44, 56];
const DARK_TONES = [58, 46, 59, 44, 56, 48];
const LIGHT_CHROMA = 48;
const DARK_CHROMA = 52;

const BAND: Record<'light' | 'dark', [number, number]> = {
  light: [0.43, 0.77],
  dark: [0.48, 0.67],
};
const CHROMA_FLOOR = 0.1;
const CVD_FLOOR = 6.0;
const NORMAL_FLOOR = 15.0;
const CONTRAST_MIN = 3.0;

// Machado, Oliveira & Fernandes (2009) CVD transforms at severity 1.0 (linear RGB)
const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
} as const;

type Lin = [number, number, number];

const hex2lin = (h: string): Lin => {
  const s = h.replace(/^#/, '');
  const c = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
  return c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as Lin;
};

const oklabFromLin = ([r, g, b]: Lin): Lin => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const simulate = (linRgb: Lin, kind: keyof typeof MACHADO): Lin => {
  const M = MACHADO[kind];
  const clamp = (c: number) => Math.max(0, Math.min(1, c));
  return [
    clamp(M[0][0] * linRgb[0] + M[0][1] * linRgb[1] + M[0][2] * linRgb[2]),
    clamp(M[1][0] * linRgb[0] + M[1][1] * linRgb[1] + M[1][2] * linRgb[2]),
    clamp(M[2][0] * linRgb[0] + M[2][1] * linRgb[1] + M[2][2] * linRgb[2]),
  ];
};

const deltaE = (h1: string, h2: string, kind?: keyof typeof MACHADO): number => {
  const a = oklabFromLin(kind ? simulate(hex2lin(h1), kind) : hex2lin(h1));
  const b = oklabFromLin(kind ? simulate(hex2lin(h2), kind) : hex2lin(h2));
  return 100 * Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
};

const relLum = (h: string): number => {
  const [r, g, b] = hex2lin(h);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

interface Slot {
  hue: number;
  tone: number;
  chroma: number;
}

const render = (slot: Slot): string =>
  hexFromArgb(TonalPalette.fromHueAndChroma((slot.hue % 360 + 360) % 360, slot.chroma).tone(slot.tone));

/** verify all checks; returns null when passing, else a fix hint */
function firstViolation(
  hexes: string[],
  mode: 'light' | 'dark',
  surface: string,
): { kind: 'band' | 'chroma' | 'contrast'; i: number } | { kind: 'pair'; i: number; j: number } | null {
  const [lo, hi] = BAND[mode];
  for (let i = 0; i < hexes.length; i++) {
    const lab = oklabFromLin(hex2lin(hexes[i]!));
    const L = lab[0];
    const C = Math.hypot(lab[1], lab[2]);
    if (L < lo || L > hi) return { kind: 'band', i };
    if (C < CHROMA_FLOOR) return { kind: 'chroma', i };
    if (contrast(hexes[i]!, surface) < CONTRAST_MIN) return { kind: 'contrast', i };
  }
  for (let i = 0; i < hexes.length - 1; i++) {
    const j = i + 1;
    const cvd = Math.min(deltaE(hexes[i]!, hexes[j]!, 'protan'), deltaE(hexes[i]!, hexes[j]!, 'deutan'));
    if (cvd < CVD_FLOOR) return { kind: 'pair', i, j };
    if (deltaE(hexes[i]!, hexes[j]!) < NORMAL_FLOOR) return { kind: 'pair', i, j };
  }
  return null;
}

/**
 * Six categorical chart colors for the given seed + mode, snapped until the
 * ported validator checks pass (bounded search; deterministic).
 */
export function createChartPalette(seedColor: string, dark: boolean, surface: string): string[] {
  const mode = dark ? 'dark' : 'light';
  const seedHue = Hct.fromInt(argbFromHex(seedColor)).hue;
  const baseTones = dark ? DARK_TONES : LIGHT_TONES;
  const chroma = dark ? DARK_CHROMA : LIGHT_CHROMA;
  const [lo, hi] = BAND[mode];
  const midTone = dark ? 52 : 50;

  const slots: Slot[] = ROTATIONS.map((rot, i) => ({
    hue: seedHue + rot,
    tone: baseTones[i]!,
    chroma,
  }));

  for (let iter = 0; iter < 80; iter++) {
    const hexes = slots.map(render);
    const v = firstViolation(hexes, mode, surface);
    if (!v) return hexes;

    if (v.kind === 'pair') {
      // adjacent pair too close: push tones apart, hue-walk when pinned
      const [a, b] = [slots[v.i]!, slots[v.j]!];
      const [lighter, darker] = a.tone >= b.tone ? [a, b] : [b, a];
      const canLighten = lighter.tone < (dark ? 64 : 68);
      const canDarken = darker.tone > (dark ? 44 : 36);
      if (canLighten || canDarken) {
        if (canLighten) lighter.tone += 2;
        if (canDarken) darker.tone -= 2;
      } else {
        b.hue += 18;
        b.tone = midTone;
      }
    } else if (v.kind === 'band') {
      const L = oklabFromLin(hex2lin(hexes[v.i]!))[0];
      slots[v.i]!.tone += L > hi ? -2 : 2;
    } else if (v.kind === 'chroma') {
      // gray-ish hue at this tone — try more chroma, then walk the hue
      if (slots[v.i]!.chroma < 72) slots[v.i]!.chroma += 8;
      else slots[v.i]!.hue += 20;
    } else {
      slots[v.i]!.tone += dark ? 2 : -2;
    }
  }
  // bounded search exhausted — return best effort (never throws in a theme)
  return slots.map(render);
}

/** true when all ported checks pass — exposed for tests */
export function chartPaletteIsValid(hexes: string[], dark: boolean, surface: string): boolean {
  return firstViolation(hexes, dark ? 'dark' : 'light', surface) === null;
}
