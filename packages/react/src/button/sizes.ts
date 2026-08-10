/**
 * Expressive button size system — measurements from specs/button.md
 * (m3.material.io/components/buttons/specs).
 */
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type ButtonShape = 'round' | 'square';

export interface ButtonSizeSpec {
  height: number;
  iconSize: number;
  /** corner radius of the "square" shape option (round = height/2) */
  squareRadius: number;
}

export const BUTTON_SIZES: Record<ButtonSize, ButtonSizeSpec> = {
  xs: { height: 32, iconSize: 20, squareRadius: 12 },
  s: { height: 40, iconSize: 20, squareRadius: 12 },
  m: { height: 56, iconSize: 24, squareRadius: 16 },
  l: { height: 96, iconSize: 32, squareRadius: 28 },
  xl: { height: 136, iconSize: 40, squareRadius: 28 },
};

export function restingRadius(size: ButtonSize, shape: ButtonShape): number {
  return shape === 'round' ? BUTTON_SIZES[size].height / 2 : BUTTON_SIZES[size].squareRadius;
}

/** Pressed-state corner radius — a dedicated third value; round and square
 * buttons share the same pressed shape (audited 2026-08-09 against
 * m3.material.io/components/buttons/specs "Corner sizes"). */
export const PRESSED_RADIUS: Record<ButtonSize, number> = {
  xs: 8,
  s: 8,
  m: 12,
  l: 16,
  xl: 16,
};

/** The press morph springs toward the shared pressed-state radius. */
export function morphTargetRadius(size: ButtonSize, _shape: ButtonShape): number {
  return PRESSED_RADIUS[size];
}
