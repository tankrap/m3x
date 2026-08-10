import * as React from 'react';
import { IconButton } from '../icon-button/IconButton';

export interface DatePickerProps {
  /** selected date */
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** initially displayed month (defaults to value or today) */
  initialMonth?: Date;
  /** 0 = Sunday (default) */
  firstDayOfWeek?: 0 | 1;
  className?: string;
  'aria-label'?: string;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const sameDay = (a: Date | null | undefined, b: Date) =>
  !!a &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * M3 docked date picker: month grid with today/selected treatments.
 * Spec: specs/pickers-sheets.md
 */
export function DatePicker({
  value = null,
  onChange,
  initialMonth,
  firstDayOfWeek = 0,
  className,
  ...aria
}: DatePickerProps) {
  const [view, setView] = React.useState(() => {
    const base = initialMonth ?? value ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const today = new Date();
  const firstOfMonth = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div
      className={['m3x-date-picker', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={aria['aria-label'] ?? 'Choose date'}
    >
      <div className="m3x-date-picker__header">
        <IconButton icon="chevron_left" aria-label="Previous month" onClick={() => shift(-1)} />
        <span className="m3x-date-picker__month" aria-live="polite">
          {MONTHS[view.month]} {view.year}
        </span>
        <IconButton icon="chevron_right" aria-label="Next month" onClick={() => shift(1)} />
      </div>
      <div className="m3x-date-picker__grid" role="grid">
        {WEEKDAYS.slice(firstDayOfWeek)
          .concat(WEEKDAYS.slice(0, firstDayOfWeek))
          .map((d, i) => (
            <span key={`w${i}`} className="m3x-date-picker__weekday" aria-hidden="true">
              {d}
            </span>
          ))}
        {cells.map((day, i) => {
          if (day == null) return <span key={i} />;
          const date = new Date(view.year, view.month, day);
          const isSelected = sameDay(value, date);
          const isToday = sameDay(today, date);
          return (
            <button
              key={i}
              type="button"
              className="m3x-date-picker__day m3x-focus-host"
              data-selected={isSelected || undefined}
              data-today={isToday || undefined}
              aria-pressed={isSelected}
              aria-label={date.toDateString()}
              onClick={() => onChange?.(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
