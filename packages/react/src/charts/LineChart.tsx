import * as React from 'react';
import { fmt, linePath, niceTicks, Pt, seriesColor, smoothPath } from './utils';

export interface LineSeries {
  label: string;
  values: number[];
  color?: string;
}

export interface LineChartProps {
  series: LineSeries[];
  /** x-axis labels (evenly spaced) */
  labels?: string[];
  width?: number;
  height?: number;
  /** catmull-rom smoothing (default true) */
  smooth?: boolean;
  showPoints?: boolean;
  showGrid?: boolean;
  legend?: boolean;
  /** fill under each line (used by AreaChart) */
  area?: boolean;
  className?: string;
  'aria-label'?: string;
}

const PAD_LEFT = 34;
const PAD_BOTTOM = 22;
const PAD_TOP = 10;
const PAD_RIGHT = 18;

/**
 * M3-style line chart: smooth 3dp rounded strokes, subtle grid, theme palette,
 * optional area fill. Extras component.
 */
export function LineChart({
  series,
  labels = [],
  width = 420,
  height = 220,
  smooth = true,
  showPoints = false,
  showGrid = true,
  legend = false,
  area = false,
  className,
  ...aria
}: LineChartProps) {
  const n = Math.max(...series.map((s) => s.values.length), 2);
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values), 1));
  const yMax = ticks[ticks.length - 1]!;
  const plotW = width - PAD_LEFT - PAD_RIGHT;
  const plotH = height - PAD_TOP - PAD_BOTTOM;

  const x = (i: number) => PAD_LEFT + (plotW * i) / (n - 1);
  const y = (v: number) => PAD_TOP + plotH * (1 - v / yMax);
  const baseline = PAD_TOP + plotH;

  // thin the x labels when they'd collide
  const labelStride = Math.max(1, Math.ceil(labels.length / Math.floor(plotW / 48)));

  return (
    <div className={['m3x-chart__wrap', className].filter(Boolean).join(' ')}>
      <svg
        className="m3x-chart m3x-line-chart"
        width={width}
        height={height}
        role="img"
        aria-label={aria['aria-label'] ?? 'Line chart'}
      >
        {showGrid &&
          ticks.map((t) => (
            <g key={t}>
              <line x1={PAD_LEFT} x2={width - PAD_RIGHT} y1={y(t)} y2={y(t)} className="m3x-chart__grid" />
              <text x={PAD_LEFT - 6} y={y(t) + 3} className="m3x-chart__tick" textAnchor="end">
                {fmt(t)}
              </text>
            </g>
          ))}
        {labels.map(
          (label, i) =>
            i % labelStride === 0 && (
              <text key={i} x={x(i)} y={height - 6} className="m3x-chart__tick" textAnchor="middle">
                {label}
              </text>
            ),
        )}
        {series.map((s, si) => {
          const pts: Pt[] = s.values.map((v, i) => ({ x: x(i), y: y(v) }));
          const path = smooth ? smoothPath(pts) : linePath(pts);
          const color = s.color ?? seriesColor(si);
          return (
            <g key={si}>
              {area && pts.length > 0 && (
                <path
                  d={`${path} L ${pts[pts.length - 1]!.x.toFixed(2)} ${baseline} L ${pts[0]!.x.toFixed(2)} ${baseline} Z`}
                  className="m3x-line-chart__area"
                  style={{ fill: color }}
                />
              )}
              <path d={path} className="m3x-line-chart__line" style={{ stroke: color }}>
                <title>{s.label}</title>
              </path>
              {showPoints &&
                pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    className="m3x-line-chart__point"
                    style={{ fill: color }}
                  />
                ))}
            </g>
          );
        })}
      </svg>
      {legend && (
        <ul className="m3x-chart__legend">
          {series.map((s, i) => (
            <li key={i}>
              <span className="m3x-chart__legend-dot" style={{ background: s.color ?? seriesColor(i) }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type AreaChartProps = Omit<LineChartProps, 'area'>;

/** Area chart: a LineChart with a translucent fill under each series. */
export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} area aria-label={props['aria-label'] ?? 'Area chart'} />;
}
