import * as React from 'react';
import { arcPath, seriesColor } from './utils';

export interface PieSlice {
  value: number;
  label: string;
  color?: string;
}

export interface PieChartProps {
  slices: PieSlice[];
  size?: number;
  /** ring thickness; ≥ size/2 renders a solid pie */
  thickness?: number;
  /** gap between slices in degrees */
  gap?: number;
  /** center content (donut only) — defaults to the total */
  children?: React.ReactNode;
  label?: React.ReactNode;
  legend?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * M3-style donut/pie chart: rounded slice caps, gaps between slices, tonal
 * palette from the theme, optional center summary and legend.
 * Extras component.
 */
export function PieChart({
  slices,
  size = 180,
  thickness = 28,
  gap = 3,
  children,
  label,
  legend = true,
  className,
  ...aria
}: PieChartProps) {
  const total = slices.reduce((s, sl) => s + Math.max(0, sl.value), 0);
  const solid = thickness >= size / 2;
  const stroke = solid ? size / 2 : thickness;
  const r = (size - stroke) / 2;
  const c = size / 2;

  const drawn = slices.filter((s) => s.value > 0);
  const effGap = drawn.length > 1 ? gap : 0;
  const usable = 360 - effGap * drawn.length;

  let cursor = 0;
  const arcs = drawn.map((slice, i) => {
    const sweep = total > 0 ? (slice.value / total) * usable : 0;
    const d = arcPath(c, c, r, cursor, Math.max(cursor + sweep, cursor + 0.5));
    cursor += sweep + effGap;
    return { ...slice, d, color: slice.color ?? seriesColor(i), pct: total ? slice.value / total : 0 };
  });

  return (
    <div className={['m3x-chart m3x-pie', className].filter(Boolean).join(' ')}>
      <div className="m3x-gauge" role="img" aria-label={aria['aria-label'] ?? 'Pie chart'} style={{ width: size, height: size }}>
        <svg width={size} height={size} aria-hidden="true">
          {arcs.map((a, i) => (
            <path
              key={i}
              d={a.d}
              className="m3x-pie__slice"
              style={{ stroke: a.color }}
              strokeWidth={stroke}
            />
          ))}
        </svg>
        {!solid && (
          <div className="m3x-gauge__center">
            <span className="m3x-gauge__number">{children ?? Math.round(total)}</span>
            {label && <span className="m3x-gauge__label">{label}</span>}
          </div>
        )}
      </div>
      {legend && (
        <ul className="m3x-chart__legend">
          {arcs.map((a, i) => (
            <li key={i}>
              <span className="m3x-chart__legend-dot" style={{ background: a.color }} />
              {a.label}
              <span className="m3x-chart__legend-value">{Math.round(a.pct * 100)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
