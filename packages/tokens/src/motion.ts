/**
 * M3 Expressive motion-physics tokens.
 *
 * Spec: https://m3.material.io/styles/motion/overview — see specs/motion.md for the
 * extracted table. Values mirror Compose material3 `MotionScheme.expressive()` /
 * `MotionScheme.standard()` (Apache-2.0): two spring families —
 *   spatial (movement/size/shape; may overshoot) and
 *   effects (color/opacity/elevation; never overshoots)
 * — each at default/fast/slow speeds.
 */

export interface SpringToken {
  /** ζ — 1 is critically damped, <1 overshoots */
  dampingRatio: number;
  /** Compose-style stiffness (mass = 1) */
  stiffness: number;
}

export interface MotionSchemeTokens {
  spatial: { default: SpringToken; fast: SpringToken; slow: SpringToken };
  effects: { default: SpringToken; fast: SpringToken; slow: SpringToken };
}

const effects = {
  default: { dampingRatio: 1, stiffness: 1600 },
  fast: { dampingRatio: 1, stiffness: 3800 },
  slow: { dampingRatio: 1, stiffness: 800 },
} as const;

export const expressiveMotionScheme: MotionSchemeTokens = {
  spatial: {
    default: { dampingRatio: 0.8, stiffness: 380 },
    fast: { dampingRatio: 0.6, stiffness: 800 },
    slow: { dampingRatio: 0.8, stiffness: 200 },
  },
  effects,
};

export const standardMotionScheme: MotionSchemeTokens = {
  spatial: {
    default: { dampingRatio: 0.9, stiffness: 700 },
    fast: { dampingRatio: 0.9, stiffness: 1400 },
    slow: { dampingRatio: 0.9, stiffness: 300 },
  },
  effects,
};

export type MotionSchemeName = 'expressive' | 'standard';

export const motionSchemes: Record<MotionSchemeName, MotionSchemeTokens> = {
  expressive: expressiveMotionScheme,
  standard: standardMotionScheme,
};

/** Legacy md.sys.motion easing tokens (kept for CSS-only transitions + fallbacks). */
export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  linear: 'linear',
} as const;

/** Legacy md.sys.motion.duration tokens (ms). */
export const duration = {
  short1: 50, short2: 100, short3: 150, short4: 200,
  medium1: 250, medium2: 300, medium3: 350, medium4: 400,
  long1: 450, long2: 500, long3: 550, long4: 600,
  extraLong1: 700, extraLong2: 800, extraLong3: 900, extraLong4: 1000,
} as const;
