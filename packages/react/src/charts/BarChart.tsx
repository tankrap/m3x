import * as React from 'react';
import { ChartHeader, ChartHeaderSpec, useActiveIndex, useMounted } from './ChartHeader';
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
  /** full-height rounded tracks behind the bars */
  tracks?: boolean;
  /** hover highlighting + header swap (default true) */
  interactive?: boolean;
  /** BoardUI-style caption + count-up numeral above the chart */
  header?: ChartHeaderSpec;
  onActiveChange?: (index: number | null) => void;
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
 * M3-style interactive bar chart: rounded bars over tonal tracks, hover ring +
 * active emphasis, optional count-up header that swaps to the hovered datum.
 * Extras component.
 */
export function BarChart({
  data,
  width = 420,
  height = 220,
  showValues = false,
  showGrid = true,
  tracks = true,
  interactive = true,
  header,
  onActiveChange,
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
  const mounted = useMounted();

  const y = (v: number) => PAD_TOP + plotH * (1 - v / yMax);
  const total = data.reduce((s, d) => s + d.value, 0);

  const { active, onPointerMove, onPointerLeave, onMouseMove, onMouseLeave } = useActiveIndex(
    data.length,
    (px) => Math.floor((px - PAD_LEFT) / slot),
    onActiveChange,
  );

  return (
    <div className={['m3x-chart__wrap', className].filter(Boolean).join(' ')}>
      {header && (
        <ChartHeader
          spec={header}
          restingValue={total}
          active={
            active != null && data[active]
              ? { label: data[active].label, value: data[active].value }
              : null
          }
        />
      )}
      <svg
        className="m3x-chart m3x-bar-chart"
        width={width}
        height={height}
        role="img"
        aria-label={aria['aria-label'] ?? 'Bar chart'}
        onPointerMove={interactive ? onPointerMove : undefined}
        onPointerLeave={interactive ? onPointerLeave : undefined}
        onMouseMove={interactive ? onMouseMove : undefined}
        onMouseLeave={interactive ? onMouseLeave : undefined}
      >
        {showGrid &&
          ticks.map((t) => (
            <text key={t} x={PAD_LEFT - 6} y={y(t) + 3} className="m3x-chart__tick" textAnchor="end">
              {fmt(t)}
            </text>
          ))}
        {data.map((d, i) => {
          const h = Math.max(2, plotH * (d.value / yMax));
          const bx = PAD_LEFT + slot * i + (slot - barW) / 2;
          const by = PAD_TOP + plotH - h;
          const isActive = interactive && i === active;
          return (
            <g key={i}>
              {tracks && (
                <rect
                  x={bx}
                  y={PAD_TOP}
                  width={barW}
                  height={plotH}
                  rx={rx}
                  className="m3x-bar-chart__track"
                />
              )}
              {interactive && (
                <rect
                  x={bx - 3}
                  y={PAD_TOP - 3}
                  width={barW + 6}
                  height={plotH + 6}
                  rx={rx + 3}
                  className="m3x-bar-chart__ring"
                  data-active={isActive || undefined}
                />
              )}
              <rect
                x={bx}
                y={mounted ? by : PAD_TOP + plotH}
                width={barW}
                height={mounted ? h : 0}
                rx={Math.min(rx, h / 2)}
                className="m3x-bar-chart__bar"
                data-active={isActive || undefined}
                style={{ fill: d.color ?? color }}
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </rect>
              {showValues && (
                <text x={bx + barW / 2} y={by - 7} className="m3x-chart__value" textAnchor="middle">
                  {fmt(d.value)}
                </text>
              )}
              <text
                x={bx + barW / 2}
                y={height - 6}
                className="m3x-chart__tick"
                data-active={isActive || undefined}
                textAnchor="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
