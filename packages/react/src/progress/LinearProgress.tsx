import * as React from 'react';
import { useTheme } from '@tankmrap/m3x-primitives';

export interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0..1; omit for indeterminate */
  value?: number;
  /** Expressive wavy active indicator */
  wavy?: boolean;
  /** track/indicator thickness (dp) */
  thickness?: number;
  /** wave amplitude (dp) */
  amplitude?: number;
  /** wave length (dp) */
  wavelength?: number;
  /** 4dp stop dot at the track end */
  stopIndicator?: boolean;
}

const GAP = 4;
/** one wavelength of phase travel per ~850ms */
const PHASE_SPEED = (wavelength: number) => wavelength / 0.85;

/**
 * M3 progress: linear determinate with Expressive wavy option, 4dp active/track
 * gap and stop indicator; classic two-segment indeterminate.
 * Spec: specs/progress-indicators.md
 */
export function LinearProgress({
  value,
  wavy = false,
  thickness = 4,
  amplitude = 3,
  wavelength = 40,
  stopIndicator = true,
  className,
  style,
  ...rest
}: LinearProgressProps) {
  const { reducedMotion } = useTheme();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [phase, setPhase] = React.useState(0);
  const indeterminate = value == null;

  React.useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.getBoundingClientRect().width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const animateWave = wavy && !indeterminate && !reducedMotion;
  React.useEffect(() => {
    if (!animateWave) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setPhase((p) => p + ((now - last) / 1000) * PHASE_SPEED(wavelength));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animateWave, wavelength]);

  const svgHeight = thickness + 2 * amplitude;
  const cy = svgHeight / 2;
  const r = thickness / 2;

  let content: React.ReactNode = null;
  if (!indeterminate && width > 0) {
    const v = Math.min(1, Math.max(0, value));
    const activeEnd = v * width;
    // wave flattens near completion
    const amp = wavy ? amplitude * Math.min(1, (1 - v) * 8) : 0;

    let activePath = '';
    if (activeEnd > thickness) {
      if (amp > 0.05) {
        const pts: string[] = [];
        for (let x = r; x <= activeEnd - r; x += 2) {
          const y = cy + amp * Math.sin(((x + phase) / wavelength) * Math.PI * 2);
          pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        activePath = pts.join('');
      } else {
        activePath = `M${r} ${cy}L${Math.max(r, activeEnd - r)} ${cy}`;
      }
    }

    const trackStart = activeEnd > thickness ? activeEnd + GAP + thickness : r;
    const trackEnd = width - r;

    content = (
      <svg width={width} height={svgHeight} className="m3x-linear-progress__svg" aria-hidden="true">
        {trackStart < trackEnd && (
          <path
            d={`M${trackStart} ${cy}L${trackEnd} ${cy}`}
            className="m3x-linear-progress__track"
            strokeWidth={thickness}
          />
        )}
        {activePath && (
          <path
            d={activePath}
            className="m3x-linear-progress__active"
            strokeWidth={thickness}
            fill="none"
          />
        )}
        {stopIndicator && v < 0.98 && (
          <circle cx={width - 2} cy={cy} r={2} className="m3x-linear-progress__stop" />
        )}
      </svg>
    );
  } else if (indeterminate) {
    content = (
      <div className="m3x-linear-progress__indeterminate" style={{ height: thickness }}>
        <span className="m3x-linear-progress__bar m3x-linear-progress__bar1" />
        <span className="m3x-linear-progress__bar m3x-linear-progress__bar2" />
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={indeterminate ? undefined : value}
      className={['m3x-linear-progress', className].filter(Boolean).join(' ')}
      style={{ height: svgHeight, ...style }}
      {...rest}
    >
      {content}
    </div>
  );
}
