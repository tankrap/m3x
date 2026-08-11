import * as React from 'react';
import { ChartHeader, ChartHeaderSpec, ChartLegend, useActiveIndex, useMounted } from './ChartHeader';
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
  /** dashed hover cursor + pulsing dots + header swap (default true) */
  interactive?: boolean;
  /** BoardUI-style caption + count-up numeral above the chart (uses series[0]) */
  header?: ChartHeaderSpec;
  onActiveChange?: (index: number | null) => void;
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
 * M3-style interactive line chart: smooth rounded strokes that draw in on
 * mount, dashed hover cursor with pulsing dots, count-up header swap.
 * Extras component.
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
  interactive = true,
  header,
  onActiveChange,
  area = false,
  className,
  ...aria
}: LineChartProps) {
  const n = Math.max(...series.map((s) => s.values.length), 2);
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values), 1));
  const yMax = ticks[ticks.length - 1]!;
  const plotW = width - PAD_LEFT - PAD_RIGHT;
  const plotH = height - PAD_TOP - PAD_BOTTOM;
  const mounted = useMounted();

  const x = (i: number) => PAD_LEFT + (plotW * i) / (n - 1);
  const y = (v: number) => PAD_TOP + plotH * (1 - v / yMax);
  const baseline = PAD_TOP + plotH;

  const { active, onPointerMove, onPointerLeave, onMouseMove, onMouseLeave } = useActiveIndex(
    n,
    (px) => Math.round(((px - PAD_LEFT) / plotW) * (n - 1)),
    onActiveChange,
  );

  const primarySeries = series[0];
  const restingValue = primarySeries
    ? primarySeries.values[primarySeries.values.length - 1]!
    : 0;

  // thin the x labels when they'd collide
  const labelStride = Math.max(1, Math.ceil(labels.length / Math.floor(plotW / 48)));

  return (
    <div className={['m3x-chart__wrap', className].filter(Boolean).join(' ')}>
      {header && (
        <ChartHeader
          spec={header}
          restingValue={restingValue}
          active={
            active != null && primarySeries && primarySeries.values[active] != null
              ? { label: labels[active] ?? `#${active + 1}`, value: primarySeries.values[active] }
              : null
          }
        />
      )}
      <svg
        className="m3x-chart m3x-line-chart"
        width={width}
        height={height}
        role="img"
        aria-label={aria['aria-label'] ?? 'Line chart'}
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
        {labels.map(
          (label, i) =>
            i % labelStride === 0 && (
              <text
                key={i}
                x={x(i)}
                y={height - 6}
                className="m3x-chart__tick"
                data-active={(interactive && i === active) || undefined}
                textAnchor="middle"
              >
                {label}
              </text>
            ),
        )}
        {interactive && active != null && (() => {
          // Per-series value pills at the active index. Placement is
          // position-aware: each pill prefers the side (above/below its dot)
          // with the most clearance from every curve in the pill's x-zone,
          // stays inside the plot, and pills push apart so they never overlap.
          const ax = x(active);
          const flip = ax > width - 76;
          const yTop = PAD_TOP + 10;
          const yBottom = baseline - 10;
          const clamp = (v: number) => Math.min(yBottom, Math.max(yTop, v));
          // curve heights near the active x (all series, neighbor points too)
          const occupied: number[] = [];
          for (const s of series) {
            for (const idx of [active - 1, active, active + 1]) {
              const v = s.values[idx];
              if (v != null) occupied.push(y(v));
            }
          }
          const clearance = (cy: number, placed: number[]) => {
            let d = Math.min(...occupied.map((o) => Math.abs(cy - o)), 99);
            for (const p of placed) d = Math.min(d, Math.abs(cy - p));
            return d;
          };
          const placedYs: number[] = [];
          const entries = series
            .map((s, si) => ({ si, v: s.values[active], color: s.color ?? seriesColor(si) }))
            .filter((e): e is { si: number; v: number; color: string } => e.v != null)
            .sort((a, b) => y(a.v) - y(b.v))
            .map((e) => {
              const dotY = y(e.v);
              const above = clamp(dotY - 18);
              const below = clamp(dotY + 18);
              // small bias toward "above" when clearances tie
              const labelY =
                clearance(above, placedYs) + 1.5 >= clearance(below, placedYs) ? above : below;
              placedYs.push(labelY);
              return { ...e, labelY };
            })
            .sort((a, b) => a.labelY - b.labelY);
          // final anti-overlap pass (min 20px apart, kept inside the plot)
          for (let k = 1; k < entries.length; k++) {
            if (entries[k]!.labelY - entries[k - 1]!.labelY < 20) {
              entries[k]!.labelY = entries[k - 1]!.labelY + 20;
            }
          }
          for (let k = entries.length - 1; k >= 0; k--) {
            if (entries[k]!.labelY > yBottom) entries[k]!.labelY = yBottom;
            if (k < entries.length - 1 && entries[k + 1]!.labelY - entries[k]!.labelY < 20) {
              entries[k]!.labelY = entries[k + 1]!.labelY - 20;
            }
          }
          return entries.map((e) => {
            const text = fmt(e.v);
            const w = 14 + text.length * 7;
            const rx2 = flip ? ax - 12 - w : ax + 12;
            return (
              <g key={`pill-${e.si}`} className="m3x-line-chart__value-pill">
                <rect x={rx2} y={e.labelY - 9} width={w} height={18} rx={9} />
                <circle cx={rx2 + 8} cy={e.labelY} r={3} style={{ fill: e.color }} />
                <text x={rx2 + 14} y={e.labelY + 3.5}>{text}</text>
              </g>
            );
          });
        })()}
        {series.map((s, si) => {
          const pts: Pt[] = s.values.map((v, i) => ({ x: x(i), y: y(v) }));
          const path = smooth ? smoothPath(pts) : linePath(pts);
          const color = s.color ?? seriesColor(si);
          const activePt = active != null ? pts[active] : null;
          return (
            <g key={si}>
              {area && pts.length > 0 && (
                <path
                  d={`${path} L ${pts[pts.length - 1]!.x.toFixed(2)} ${baseline} L ${pts[0]!.x.toFixed(2)} ${baseline} Z`}
                  className="m3x-line-chart__area"
                  data-mounted={mounted || undefined}
                  style={{ fill: color }}
                />
              )}
              <path
                d={path}
                className="m3x-line-chart__line"
                data-mounted={mounted || undefined}
                pathLength={1}
                style={{ stroke: color }}
              >
                <title>{s.label}</title>
              </path>
              {showPoints &&
                pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    className="m3x-line-chart__point"
                    style={{ fill: color }}
                  />
                ))}
              {interactive && activePt && (
                <g className="m3x-line-chart__active-dot" style={{ color }}>
                  <circle cx={activePt.x} cy={activePt.y} r={10} className="m3x-line-chart__pulse" />
                  <circle cx={activePt.x} cy={activePt.y} r={4.5} className="m3x-line-chart__dot" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {legend && (
        <ChartLegend
          items={series.map((s, i) => ({ label: s.label, color: s.color ?? seriesColor(i) }))}
        />
      )}
    </div>
  );
}

export type AreaChartProps = Omit<LineChartProps, 'area'>;

/** Area chart: a LineChart with a translucent fill under each series. */
export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} area aria-label={props['aria-label'] ?? 'Area chart'} />;
}
