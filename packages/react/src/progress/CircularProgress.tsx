import * as React from 'react';
import { useTheme } from '@m3x/primitives';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0..1; omit for indeterminate (prefer LoadingIndicator for that) */
  value?: number;
  wavy?: boolean;
  size?: number;
  thickness?: number;
  /** wavy amplitude (dp) */
  amplitude?: number;
}

const GAP = 4;
const WAVE_PERIODS = 8;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [sx, sy] = polar(cx, cy, r, startDeg);
  const [ex, ey] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${sx.toFixed(2)} ${sy.toFixed(2)}A${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

/**
 * M3 circular progress: determinate arc with 4dp active/track gap and the
 * Expressive wavy option (radially modulated active arc).
 * Spec: specs/progress-indicators.md
 */
export function CircularProgress({
  value,
  wavy = false,
  size = 48,
  thickness = 4,
  amplitude = 2,
  className,
  style,
  ...rest
}: CircularProgressProps) {
  const { reducedMotion } = useTheme();
  const [phase, setPhase] = React.useState(0);
  const indeterminate = value == null;

  const animateWave = wavy && !indeterminate && !reducedMotion;
  React.useEffect(() => {
    if (!animateWave) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setPhase((p) => p + ((now - last) / 1000) * 2.2);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animateWave]);

  const c = size / 2;
  const R = (size - thickness) / 2 - (wavy ? amplitude : 0);

  let svg: React.ReactNode;
  if (indeterminate) {
    const circumference = 2 * Math.PI * R;
    svg = (
      <svg width={size} height={size} className="m3x-circular-progress__spin" aria-hidden="true">
        <circle
          cx={c}
          cy={c}
          r={R}
          fill="none"
          className="m3x-circular-progress__active"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
        />
      </svg>
    );
  } else {
    const v = Math.min(1, Math.max(0, value));
    const sweep = v * 360;
    const gapDeg = (((GAP + thickness) / R) * 180) / Math.PI;
    const amp = wavy ? amplitude * Math.min(1, (1 - v) * 8) : 0;

    let activePath = '';
    if (sweep > 1) {
      if (amp > 0.05 && sweep > 10) {
        const pts: string[] = [];
        for (let a = 0; a <= sweep; a += 3) {
          const rr = R + amp * Math.sin((a / 360) * WAVE_PERIODS * Math.PI * 2 + phase);
          const [x, y] = polar(c, c, rr, a);
          pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
        }
        activePath = pts.join('');
      } else {
        activePath = arcPath(c, c, R, 0, Math.min(sweep, 359.9));
      }
    }

    const trackStart = sweep + gapDeg;
    const trackEnd = 360 - (sweep > 1 ? gapDeg : 0);

    svg = (
      <svg width={size} height={size} aria-hidden="true">
        {trackStart < trackEnd && (
          <path
            d={arcPath(c, c, R, trackStart, trackEnd)}
            className="m3x-circular-progress__track"
            strokeWidth={thickness}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {activePath && (
          <path
            d={activePath}
            className="m3x-circular-progress__active"
            strokeWidth={thickness}
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    );
  }

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={indeterminate ? undefined : value}
      className={['m3x-circular-progress', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {svg}
    </div>
  );
}
