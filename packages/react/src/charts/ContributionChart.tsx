import * as React from 'react';

export interface ContributionEntry {
  /** ISO date string (yyyy-mm-dd) or Date */
  date: string | Date;
  value: number;
}

export interface ContributionChartProps {
  entries: ContributionEntry[];
  /** number of trailing weeks to show */
  weeks?: number;
  /** last day of the grid (defaults to today) */
  endDate?: Date;
  cellSize?: number;
  cellGap?: number;
  /** 0 = Sunday (default) */
  firstDayOfWeek?: 0 | 1;
  /** format the per-cell tooltip */
  formatTooltip?: (date: Date, value: number) => string;
  className?: string;
  'aria-label'?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', 'Wed', 'Fri'];

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Contributions heatmap: a weeks × days grid where cell intensity maps to
 * value quartiles of the primary color. Extras component.
 */
export function ContributionChart({
  entries,
  weeks = 26,
  endDate,
  cellSize = 12,
  cellGap = 3,
  firstDayOfWeek = 0,
  formatTooltip = (d, v) => `${dayKey(d)}: ${v}`,
  className,
  ...aria
}: ContributionChartProps) {
  const values = new Map<string, number>();
  let peak = 0;
  for (const e of entries) {
    const d = typeof e.date === 'string' ? new Date(`${e.date}T00:00:00`) : e.date;
    const key = dayKey(d);
    const v = (values.get(key) ?? 0) + e.value;
    values.set(key, v);
    peak = Math.max(peak, v);
  }

  const end = endDate ?? new Date();
  // align the grid so `end` falls in the last column
  const endDow = (end.getDay() - firstDayOfWeek + 7) % 7;
  const step = cellSize + cellGap;
  const top = 16; // month label row
  const left = 30; // weekday label column
  const width = left + weeks * step;
  const height = top + 7 * step;

  const level = (v: number | undefined): number => {
    if (!v || peak === 0) return 0;
    return Math.min(4, Math.max(1, Math.ceil((v / peak) * 4)));
  };

  const cells: React.ReactNode[] = [];
  const monthLabels: React.ReactNode[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const daysBack = (weeks - 1 - w) * 7 + (endDow - d);
      if (daysBack < 0) continue; // future days in the last week
      const date = new Date(end);
      date.setDate(end.getDate() - daysBack);
      const v = values.get(dayKey(date));
      if (d === 0) {
        const m = date.getMonth();
        if (m !== lastMonth && w < weeks - 1) {
          if (lastMonth !== -1 || w === 0) {
            monthLabels.push(
              <text key={`m${w}`} x={left + w * step} y={10} className="m3x-heatmap__month">
                {MONTHS[m]}
              </text>,
            );
          }
          lastMonth = m;
        }
      }
      cells.push(
        <rect
          key={`${w}-${d}`}
          x={left + w * step}
          y={top + d * step}
          width={cellSize}
          height={cellSize}
          rx={3}
          className="m3x-heatmap__cell"
          data-level={level(v)}
        >
          <title>{formatTooltip(date, v ?? 0)}</title>
        </rect>,
      );
    }
  }

  return (
    <svg
      className={['m3x-heatmap', className].filter(Boolean).join(' ')}
      width={width}
      height={height}
      role="img"
      aria-label={aria['aria-label'] ?? 'Contribution heatmap'}
    >
      {monthLabels}
      {DAY_LABELS.map((label, i) => (
        <text
          key={label}
          x={0}
          y={top + (1 + i * 2 + (firstDayOfWeek === 0 ? 0 : -1)) * step + cellSize - 2}
          className="m3x-heatmap__day"
        >
          {label}
        </text>
      ))}
      {cells}
    </svg>
  );
}
