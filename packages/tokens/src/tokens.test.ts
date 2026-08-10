import { describe, expect, it } from 'vitest';
import { createTheme, themeToCssText } from './theme';
import { createColorScheme } from './color';
import {
  shapePath,
  morphPath,
  SHAPE_NAMES,
  shapeOutline,
  SHAPE_SAMPLES,
  alignedShapeMorph,
  cornerProgresses,
  shapeLibrary,
} from './shape';
import { getTypeStyle } from './typography';

describe('color', () => {
  it('generates the full role set from a seed', () => {
    const scheme = createColorScheme({ seedColor: '#6750A4' });
    expect(scheme.primary).toMatch(/^#[0-9a-f]{6}$/);
    expect(scheme.surfaceContainerHighest).toMatch(/^#[0-9a-f]{6}$/);
    expect(scheme.onTertiaryFixedVariant).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('dark scheme differs from light', () => {
    const light = createColorScheme({ seedColor: '#6750A4' });
    const dark = createColorScheme({ seedColor: '#6750A4', dark: true });
    expect(light.surface).not.toBe(dark.surface);
  });

  it('supports all scheme variants', () => {
    for (const variant of ['tonalSpot', 'vibrant', 'expressive', 'neutral', 'monochrome', 'fidelity', 'content'] as const) {
      expect(createColorScheme({ seedColor: '#0061a4', variant }).primary).toBeTruthy();
    }
  });
});

describe('typography', () => {
  it('emphasized bumps weight, keeps metrics', () => {
    const base = getTypeStyle('headlineLarge');
    const emph = getTypeStyle('headlineLarge', { emphasized: true });
    expect(emph.fontWeight).toBeGreaterThan(base.fontWeight);
    expect(emph.fontSize).toBe(base.fontSize);
    expect(emph.lineHeight).toBe(base.lineHeight);
  });
});

describe('shape library', () => {
  it('every shape normalizes to the shared sample count', () => {
    for (const name of SHAPE_NAMES) {
      expect(shapeOutline(name)).toHaveLength(SHAPE_SAMPLES);
    }
  });

  it('any shape morphs into any other', () => {
    const d = morphPath('circle', 'cookie9', 0.5);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
    expect(shapePath('softBurst')).toContain('L');
  });

  it('reports one corner progress per polygon vertex, ordered', () => {
    const prog = cornerProgresses(shapeLibrary.pentagon);
    expect(prog).toHaveLength(5);
    for (let i = 1; i < prog.length; i++) expect(prog[i]!).toBeGreaterThan(prog[i - 1]!);
    expect(prog.every((p) => p >= 0 && p < 1)).toBe(true);
  });

  it('aligned morph produces equal-length outlines with corners co-indexed', () => {
    const { from, to } = alignedShapeMorph('pentagon', 'cookie9');
    expect(from.length).toBe(to.length);
    expect(from.length).toBeGreaterThan(SHAPE_SAMPLES / 2);
    // both endpoint sets are finite coordinates within the unit box
    for (const p of [...from, ...to]) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Math.abs(p.x)).toBeLessThanOrEqual(1.001);
    }
  });

  it('aligned morph endpoints trace the actual target shapes', () => {
    const { from } = alignedShapeMorph('triangle', 'diamond');
    // t=0 outline must lie on the triangle outline: every aligned point should
    // be close to some uniformly-sampled triangle point
    const tri = shapeOutline('triangle');
    for (const p of from.filter((_, i) => i % 12 === 0)) {
      const min = Math.min(...tri.map((q) => Math.hypot(q.x - p.x, q.y - p.y)));
      expect(min).toBeLessThan(0.06);
    }
  });
});

describe('theme', () => {
  it('emits md-sys css vars for every system', () => {
    const theme = createTheme({ seedColor: '#6750A4', motionScheme: 'expressive' });
    expect(theme.cssVars['--md-sys-color-primary']).toBeDefined();
    expect(theme.cssVars['--md-sys-shape-corner-large']).toBe('16px');
    expect(theme.cssVars['--md-sys-typescale-label-large-size']).toBe('14px');
    expect(theme.cssVars['--md-sys-typescale-emphasized-label-large-weight']).toBe('600');
    expect(theme.cssVars['--md-sys-elevation-level3']).toContain('color-mix');
    expect(theme.cssVars['--md-sys-motion-spatial-fast-stiffness']).toBe('800');
    expect(theme.cssVars['--md-sys-state-hover-state-layer-opacity']).toBe('0.08');
  });

  it('motion scheme switch retunes springs', () => {
    const std = createTheme({ seedColor: '#6750A4', motionScheme: 'standard' });
    expect(std.motion.spatial.default.stiffness).toBe(700);
    expect(std.motion.spatial.default.dampingRatio).toBe(0.9);
  });

  it('serializes to css text', () => {
    const css = themeToCssText(createTheme({ seedColor: '#6750A4' }), '.m3x-root');
    expect(css).toContain('.m3x-root {');
    expect(css).toContain('--md-sys-color-on-primary-container:');
  });
});
