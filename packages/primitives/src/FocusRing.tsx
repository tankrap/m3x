import * as React from 'react';

/**
 * M3 focus indicator: 3dp `secondary` ring, 2dp outside the container edge,
 * following the container's shape. Shown only for keyboard focus — the host
 * must have class `m3x-focus-host`; CSS reveals the ring on
 * `.m3x-focus-host:focus-visible`.
 * Spec: https://m3.material.io/foundations/interaction/states/applying-states#focus
 */
export function FocusRing({ radius }: { radius?: string }) {
  return (
    <span
      className="m3x-focus-ring"
      aria-hidden="true"
      style={radius != null ? { borderRadius: radius } : undefined}
    />
  );
}
