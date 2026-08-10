import * as React from 'react';
import type { ElevationLevel } from '@m3x/tokens';

/**
 * M3 elevation surface: absolutely-positioned shadow layer that inherits the
 * host's border-radius. Shadow values come from --md-sys-elevation-level*.
 */
export function Elevation({ level }: { level: ElevationLevel }) {
  return (
    <span
      className="m3x-elevation"
      aria-hidden="true"
      style={{ boxShadow: `var(--md-sys-elevation-level${level})` }}
    />
  );
}
