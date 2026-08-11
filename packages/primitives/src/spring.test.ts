import { describe, expect, it } from 'vitest';
import { createSpring } from './spring';
import { widthToSizeClass } from './useWindowSizeClass';
import { expressiveMotionScheme, standardMotionScheme } from '@tankmrap/m3x-tokens';

describe('window size classes', () => {
  it('maps widths to M3 breakpoints', () => {
    expect(widthToSizeClass(400)).toBe('compact');
    expect(widthToSizeClass(600)).toBe('medium');
    expect(widthToSizeClass(840)).toBe('expanded');
    expect(widthToSizeClass(1200)).toBe('large');
    expect(widthToSizeClass(1600)).toBe('extraLarge');
  });
});

describe('spring solver', () => {
  it('settles at the target', () => {
    const s = createSpring(expressiveMotionScheme.spatial.default, 0, 100);
    expect(s.at(10).value).toBeCloseTo(100, 1);
    expect(s.at(10).done).toBe(true);
  });

  it('expressive spatial springs overshoot (ζ < 1)', () => {
    const s = createSpring(expressiveMotionScheme.spatial.fast, 0, 100);
    let max = 0;
    for (let t = 0; t < 1; t += 0.005) max = Math.max(max, s.at(t).value);
    expect(max).toBeGreaterThan(100.5);
  });

  it('effects springs never overshoot (ζ = 1)', () => {
    const s = createSpring(expressiveMotionScheme.effects.default, 0, 100);
    for (let t = 0; t < 1; t += 0.005) {
      expect(s.at(t).value).toBeLessThanOrEqual(100.0001);
    }
  });

  it('standard scheme overshoots less than expressive', () => {
    const peak = (token: { dampingRatio: number; stiffness: number }) => {
      const s = createSpring(token, 0, 100);
      let max = 0;
      for (let t = 0; t < 2; t += 0.005) max = Math.max(max, s.at(t).value);
      return max;
    };
    expect(peak(standardMotionScheme.spatial.default)).toBeLessThan(
      peak(expressiveMotionScheme.spatial.default),
    );
  });

  it('starts from the initial value with initial velocity respected', () => {
    const s = createSpring(expressiveMotionScheme.spatial.default, 40, 100, 500);
    expect(s.at(0).value).toBeCloseTo(40, 5);
    // positive initial velocity → moving toward target faster than from rest
    const rest = createSpring(expressiveMotionScheme.spatial.default, 40, 100, 0);
    expect(s.at(0.05).value).toBeGreaterThan(rest.at(0.05).value);
  });
});
