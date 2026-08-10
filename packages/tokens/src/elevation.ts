/**
 * M3 elevation: 6 levels with umbra/penumbra shadow pairs.
 * Spec: https://m3.material.io/styles/elevation/overview
 * Shadow color comes from --md-sys-color-shadow (black by default); we emit
 * box-shadows with color-mix so the shadow role stays themable.
 */

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

const SHADOW = 'var(--md-sys-color-shadow, #000)';
const umbra = (v: string) => `${v} color-mix(in srgb, ${SHADOW} 30%, transparent)`;
const penumbra = (v: string) => `${v} color-mix(in srgb, ${SHADOW} 15%, transparent)`;

export const elevationShadow: Record<ElevationLevel, string> = {
  0: 'none',
  1: `${umbra('0px 1px 2px 0px')}, ${penumbra('0px 1px 3px 1px')}`,
  2: `${umbra('0px 1px 2px 0px')}, ${penumbra('0px 2px 6px 2px')}`,
  3: `${umbra('0px 1px 3px 0px')}, ${penumbra('0px 4px 8px 3px')}`,
  4: `${umbra('0px 2px 3px 0px')}, ${penumbra('0px 6px 10px 4px')}`,
  5: `${umbra('0px 4px 4px 0px')}, ${penumbra('0px 8px 12px 6px')}`,
};
