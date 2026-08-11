import * as React from 'react';
import { arcPath, polar, seriesColor } from './utils';
import { useCountUp } from './useCountUp';
import { useMounted } from './ChartHeader';

export interface GaugeProps {
  /** current value */
  value: number;
  min?: number;
  max?: number;
  /** caption under the value (e.g. a unit) */
  label?: React.ReactNode;
  /** value formatter for the center numeral */
  format?: (value: number) => React.ReactNode;
  size?: number;
  /** arc stroke width */
  thickness?: number;
  /** arc color (defaults to primary) */
  color?: string;
  className?: string;
  'aria-label'?: string;
}

const SWEEP = 270;
const START = -135;

/**
 * M3-style gauge: a 270° rounded arc that sweeps in on mount, tonal track,
 * count-up center numeral. Extras component.
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  format,
  size = 160,
  thickness = 14,
  color = seriesColor(0),
  className,
  ...aria
}: GaugeProps) {
  const frac = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const end = START + SWEEP * frac;
  const mounted = useMounted();
  const display = useCountUp(value);

  return (
    <div
      className={['m3x-gauge', className].filter(Boolean).join(' ')}
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={aria['aria-label'] ?? 'Gauge'}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} aria-hidden="true">
        <path
          d={arcPath(c, c, r, START, START + SWEEP)}
          className="m3x-gauge__track"
          strokeWidth={thickness}
        />
        {frac > 0 && (
          <path
            d={arcPath(c, c, r, START, Math.max(end, START + 0.5))}
            className="m3x-gauge__value m3x-gauge__value--sweep"
            data-mounted={mounted || undefined}
            pathLength={1}
            style={{ stroke: color }}
            strokeWidth={thickness}
          />
        )}
      </svg>
      <div className="m3x-gauge__center">
        <span className="m3x-gauge__number">
          {format ? format(display) : Math.round(display)}
        </span>
        {label && <span className="m3x-gauge__label">{label}</span>}
      </div>
    </div>
  );
}

export interface ArcSegment {
  value: number;
  label?: string;
  color?: string;
}

export interface SegmentedArcGaugeProps {
  segments: ArcSegment[];
  /** denominator; defaults to the segment sum (full arc) */
  total?: number;
  /** center content — defaults to the segment sum */
  children?: React.ReactNode;
  label?: React.ReactNode;
  size?: number;
  thickness?: number;
  /** gap between segments in degrees */
  gap?: number;
  /** show a legend under the gauge */
  legend?: boolean;
  /** hover: segment thickens + center swaps to its label/value (default true) */
  interactive?: boolean;
  onActiveChange?: (index: number | null) => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Segmented arc gauge: the 270° arc divided proportionally between series.
 * Hovering a segment thickens it and swaps the center to that segment.
 * Extras component.
 */
export function SegmentedArcGauge({
  segments,
  total,
  children,
  label,
  size = 160,
  thickness = 14,
  gap = 5,
  legend = false,
  interactive = true,
  onActiveChange,
  className,
  ...aria
}: SegmentedArcGaugeProps) {
  const sum = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);
  const denom = total != null && total > 0 ? total : sum;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const [active, setActive] = React.useState<number | null>(null);

  const drawn = segments.filter((s) => s.value > 0);
  const gapCount = denom > sum ? drawn.length : Math.max(1, drawn.length);
  const usable = SWEEP - gap * gapCount;

  let cursor = START;
  const arcs = drawn.map((seg, i) => {
    const sweep = (seg.value / denom) * usable;
    const d = arcPath(c, c, r, cursor, Math.max(cursor + sweep, cursor + 0.5));
    cursor += sweep + gap;
    return { d, color: seg.color ?? seriesColor(i), label: seg.label, value: seg.value };
  });
  // leftover track when a total is given
  const remainder = denom > sum ? arcPath(c, c, r, cursor, START + SWEEP) : null;

  const setActiveIdx = (i: number | null) => {
    if (!interactive) return;
    setActive((prev) => {
      if (prev !== i) onActiveChange?.(i);
      return i;
    });
  };

  const shown = active != null ? arcs[active] : null;
  const centerValue = useCountUp(shown ? shown.value : sum);

  return (
    <div className={['m3x-gauge__wrap', className].filter(Boolean).join(' ')}>
      <div
        className="m3x-gauge"
        role="img"
        aria-label={aria['aria-label'] ?? 'Segmented gauge'}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} aria-hidden="true" onPointerLeave={() => setActiveIdx(null)}>
          {remainder && (
            <path d={remainder} className="m3x-gauge__track" strokeWidth={thickness} />
          )}
          {arcs.map((a, i) => (
            <path
              key={i}
              d={a.d}
              className="m3x-gauge__value m3x-gauge__value--segment"
              data-active={(interactive && i === active) || undefined}
              data-dimmed={(interactive && active != null && i !== active) || undefined}
              style={{ stroke: a.color, strokeWidth: i === active ? thickness + 4 : thickness }}
              onPointerEnter={() => setActiveIdx(i)}
            />
          ))}
        </svg>
        <div className="m3x-gauge__center">
          <span className="m3x-gauge__number">
            {shown ? Math.round(centerValue) : (children ?? Math.round(centerValue))}
          </span>
          {(shown?.label || label) && (
            <span className="m3x-gauge__label">{shown ? shown.label : label}</span>
          )}
        </div>
      </div>
      {legend && (
        <ul className="m3x-chart__legend">
          {arcs.map(
            (a, i) =>
              a.label && (
                <li
                  key={i}
                  data-active={(interactive && i === active) || undefined}
                  onPointerEnter={() => setActiveIdx(i)}
                  onPointerLeave={() => setActiveIdx(null)}
                >
                  <span className="m3x-chart__legend-dot" style={{ background: a.color }} />
                  {a.label}
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
}

// re-exported for PieChart's shared geometry
export { polar };
