import * as React from 'react';
import { useSprings } from '@ibx34/m3x-primitives';
import { ButtonShape, ButtonSize, BUTTON_SIZES, restingRadius, morphTargetRadius } from './sizes';

/** [top-left, top-right, bottom-right, bottom-left] px.
 * TODO(RTL): these are physical corners; flip for RTL connected groups. */
export type Corners = [number, number, number, number];

export type GroupPosition = 'first' | 'middle' | 'last';

const uniform = (r: number): Corners => [r, r, r, r];

/** inner-edge radius for connected silhouettes — audited 2026-08-09 against
 * m3.material.io/components/button-groups/specs */
const INNER_EDGE_RADIUS: Record<ButtonSize, number> = { xs: 4, s: 8, m: 8, l: 16, xl: 20 };

export function innerEdgeRadius(size: ButtonSize): number {
  return INNER_EDGE_RADIUS[size];
}

export interface PressMorphResult {
  /** css border-radius (animated) */
  radius: string;
  pressed: boolean;
  handlers: Pick<
    React.DOMAttributes<HTMLElement>,
    'onPointerDown' | 'onPointerUp' | 'onPointerLeave' | 'onPointerCancel' | 'onKeyDown' | 'onKeyUp'
  >;
}

/**
 * The signature Expressive interaction: pressing springs the corner radii from
 * the resting shape to the morph target (`motion.spatial.fast` under press,
 * `default` on settle). Selection flips the resting shape.
 *
 * With `groupPosition` (connected button groups / split buttons) the resting
 * silhouette is asymmetric — outer edges full, inner edges small — and
 * press/selection morphs to fully rounded (specs/button-group.md).
 */
export function usePressMorph(
  size: ButtonSize,
  shape: ButtonShape,
  opts: { selected?: boolean; disabled?: boolean; groupPosition?: GroupPosition } = {},
): PressMorphResult {
  const { selected = false, disabled = false, groupPosition } = opts;
  const [pressed, setPressed] = React.useState(false);
  const active = pressed && !disabled;

  let target: Corners;
  if (groupPosition) {
    const full = BUTTON_SIZES[size].height / 2;
    const inner = innerEdgeRadius(size);
    const rest: Corners =
      groupPosition === 'first'
        ? [full, inner, inner, full]
        : groupPosition === 'last'
          ? [inner, full, full, inner]
          : uniform(inner);
    // selected/pressed members round out fully; pressing an already-round
    // (selected) member morphs back toward the inner silhouette for feedback
    target = active ? (selected ? rest : uniform(full)) : selected ? uniform(full) : rest;
  } else {
    const effective: ButtonShape = selected ? (shape === 'round' ? 'square' : 'round') : shape;
    target = uniform(
      active ? morphTargetRadius(size, effective) : restingRadius(size, effective),
    );
  }

  const corners = useSprings(target, 'spatial', active ? 'fast' : 'default');
  const radius = corners.map((c) => `${Math.max(0, c)}px`).join(' ');

  const press = () => !disabled && setPressed(true);
  const release = () => setPressed(false);

  return {
    radius,
    pressed,
    handlers: {
      onPointerDown: press,
      onPointerUp: release,
      onPointerLeave: release,
      onPointerCancel: release,
      onKeyDown: (e) => {
        if (e.key === ' ' || e.key === 'Enter') press();
      },
      onKeyUp: release,
    },
  };
}

/** Merge morph handlers with user handlers without clobbering either. */
export function chainHandlers<E extends React.SyntheticEvent>(
  ours?: (e: E) => void,
  theirs?: (e: E) => void,
): ((e: E) => void) | undefined {
  if (!ours) return theirs;
  if (!theirs) return ours;
  return (e) => {
    ours(e);
    theirs(e);
  };
}
