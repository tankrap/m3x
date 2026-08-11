import * as React from 'react';
import { fmt, niceTicks, seriesColor } from './utils';

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarDatum[];
  width?: number;
  height?: number;
  /** show the value above each bar */
  showValues?: boolean;
  /** horizontal gridlines + y-axis tick labels */
  showGrid?: boolean;
  /** single color for all bars (defaults to primary); per-datum color wins */
  color?: string;
  /** bar corner radius; defaults to half the bar width (fully rounded) */
  radius?: number;
  className?: string;
  'aria-label'?: string;
}

const PAD_LEFT = 34;
const PAD_BOTTOM = 22;
const PAD_TOP = 14;

/**
 * M3-style bar chart: rounded-top bars on a subtle grid, theme palette.
 * Extras component.
 */
export function BarChart({
  data,
  width = 420,
  height = 220,
  showValues = false,
  showGrid = true,
  color = seriesColor(0),
  radius,
  className,
  ...aria
}: BarChartProps) {
  const ticks = niceTicks(Math.max(...data.map((d) => d.value), 1));
  const yMax = ticks[ticks.length - 1]!;
  const plotW = width - PAD_LEFT - 4;
  const plotH = height - PAD_TOP - PAD_BOTTOM;
  const slot = plotW / Math.max(1, data.length);
  const barW = Math.min(40, slot * 0.55);
  const rx = radius ?? Math.min(barW / 2, 8);

  const y = (v: number) => PAD_TOP + plotH * (1 - v / yMax);

  return (
    <svg
      className={['m3x-chart m3x-bar-chart', className].filter(Boolean).join(' ')}
      width={width}
      height={height}
      role="img"
      aria-label={aria['aria-label'] ?? 'Bar chart'}
    >
      {showGrid &&
        ticks.map((t) => (
          <g key={t}>
            <line x1={PAD_LEFT} x2={width - 4} y1={y(t)} y2={y(t)} className="m3x-chart__grid" />
            <text x={PAD_LEFT - 6} y={y(t) + 3} className="m3x-chart__tick" textAnchor="end">
              {fmt(t)}
            </text>
          </g>
        ))}
      {data.map((d, i) => {
        const h = Math.max(2, plotH * (d.value / yMax));
        const bx = PAD_LEFT + slot * i + (slot - barW) / 2;
        const by = PAD_TOP + plotH - h;
        return (
          <g key={i} className="m3x-bar-chart__bar-group">
            <rect
              x={bx}
              y={by}
              width={barW}
              height={h}
              rx={Math.min(rx, h / 2)}
              className="m3x-bar-chart__bar"
              style={{ fill: d.color ?? color }}
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            {showValues && (
              <text x={bx + barW / 2} y={by - 5} className="m3x-chart__value" textAnchor="middle">
                {fmt(d.value)}
              </text>
            )}
            <text
              x={bx + barW / 2}
              y={height - 6}
              className="m3x-chart__tick"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
