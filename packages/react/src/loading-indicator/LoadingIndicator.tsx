import * as React from 'react';
import { MorphShape, useTheme } from '@ibx34/m3x-primitives';
import type { ShapeName } from '@ibx34/m3x-tokens';

/** Compose LoadingIndicator's default shape sequence. */
export const LOADING_SEQUENCE: ShapeName[] = [
  'softBurst',
  'cookie9',
  'pentagon',
  'pill',
  'sunny',
  'cookie4',
  'oval',
];

const MORPH_INTERVAL_MS = 650;

export interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** wrap the indicator in a full-round container */
  contained?: boolean;
  /** layout box; active indicator is size × 38/48 (spec: 38dp in 48dp) */
  size?: number;
  'aria-label'?: string;
}

/**
 * M3 Expressive loading indicator: indeterminate, cycles through the shape
 * library with spring morphs while rotating continuously.
 * Reduced motion: static shape with a gentle opacity pulse.
 * Spec: specs/loading-indicator.md
 */
export function LoadingIndicator({
  contained = false,
  size = 48,
  className,
  'aria-label': ariaLabel = 'Loading',
  ...rest
}: LoadingIndicatorProps) {
  const { reducedMotion } = useTheme();
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (reducedMotion) return;
    const t = window.setInterval(
      () => setIdx((i) => (i + 1) % LOADING_SEQUENCE.length),
      MORPH_INTERVAL_MS,
    );
    return () => window.clearInterval(t);
  }, [reducedMotion]);

  const indicatorSize = Math.round((size * 38) / 48);

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      className={[
        'm3x-loading-indicator',
        contained ? 'm3x-loading-indicator--contained' : undefined,
        reducedMotion ? 'm3x-loading-indicator--static' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: size, height: size }}
      {...rest}
    >
      <span className="m3x-loading-indicator__spin">
        <MorphShape shape={LOADING_SEQUENCE[idx]!} size={indicatorSize} speed="slow" />
      </span>
    </div>
  );
}
