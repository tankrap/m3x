import * as React from 'react';
import { arcPath, polar, seriesColor } from './utils';

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
 * M3-style gauge: a 270° rounded arc on a tonal track with an emphasized
 * center numeral. Extras component.
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
            className="m3x-gauge__value"
            style={{ stroke: color }}
            strokeWidth={thickness}
          />
        )}
      </svg>
      <div className="m3x-gauge__center">
        <span className="m3x-gauge__number">{format ? format(value) : Math.round(value)}</span>
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
  className?: string;
  'aria-label'?: string;
}

/**
 * Segmented arc gauge: the 270° arc divided proportionally between series
 * with rounded caps and gaps (the Pixel storage-breakdown look).
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
  className,
  ...aria
}: SegmentedArcGaugeProps) {
  const sum = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);
  const denom = total != null && total > 0 ? total : sum;
  const r = (size - thickness) / 2;
  const c = size / 2;

  const drawn = segments.filter((s) => s.value > 0);
  const gapCount = denom > sum ? drawn.length : Math.max(1, drawn.length);
  const usable = SWEEP - gap * gapCount;

  let cursor = START;
  const arcs = drawn.map((seg, i) => {
    const sweep = (seg.value / denom) * usable;
    const d = arcPath(c, c, r, cursor, Math.max(cursor + sweep, cursor + 0.5));
    cursor += sweep + gap;
    return { d, color: seg.color ?? seriesColor(i), label: seg.label };
  });
  // leftover track when a total is given
  const remainder = denom > sum ? arcPath(c, c, r, cursor, START + SWEEP) : null;

  return (
    <div className={['m3x-gauge__wrap', className].filter(Boolean).join(' ')}>
      <div
        className="m3x-gauge"
        role="img"
        aria-label={aria['aria-label'] ?? 'Segmented gauge'}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} aria-hidden="true">
          {remainder && (
            <path d={remainder} className="m3x-gauge__track" strokeWidth={thickness} />
          )}
          {arcs.map((a, i) => (
            <path
              key={i}
              d={a.d}
              className="m3x-gauge__value"
              style={{ stroke: a.color }}
              strokeWidth={thickness}
            />
          ))}
        </svg>
        <div className="m3x-gauge__center">
          <span className="m3x-gauge__number">{children ?? Math.round(sum)}</span>
          {label && <span className="m3x-gauge__label">{label}</span>}
        </div>
      </div>
      {legend && (
        <ul className="m3x-chart__legend">
          {arcs.map(
            (a, i) =>
              a.label && (
                <li key={i}>
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
