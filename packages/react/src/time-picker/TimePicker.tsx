import * as React from 'react';

export interface TimeValue {
  /** 0–23 */
  hour: number;
  minute: number;
}

export interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  /** 12-hour clock with AM/PM (default true) */
  hour12?: boolean;
  className?: string;
  'aria-label'?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * M3 time picker (input variant): two-digit hour/minute fields + period
 * selector. Dial variant deferred. Spec: specs/pickers-sheets.md
 */
export function TimePicker({ value, onChange, hour12 = true, className, ...aria }: TimePickerProps) {
  const period: 'AM' | 'PM' = value.hour < 12 ? 'AM' : 'PM';
  const displayHour = hour12 ? value.hour % 12 || 12 : value.hour;

  const setHourText = (text: string) => {
    let h = parseInt(text, 10);
    if (Number.isNaN(h)) return;
    if (hour12) {
      h = Math.min(12, Math.max(1, h)) % 12;
      onChange({ ...value, hour: period === 'PM' ? h + 12 : h });
    } else {
      onChange({ ...value, hour: Math.min(23, Math.max(0, h)) });
    }
  };

  const setMinuteText = (text: string) => {
    const m = parseInt(text, 10);
    if (Number.isNaN(m)) return;
    onChange({ ...value, minute: Math.min(59, Math.max(0, m)) });
  };

  const setPeriod = (p: 'AM' | 'PM') => {
    const base = value.hour % 12;
    onChange({ ...value, hour: p === 'PM' ? base + 12 : base });
  };

  return (
    <div
      className={['m3x-time-picker', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={aria['aria-label'] ?? 'Enter time'}
    >
      <label className="m3x-time-picker__cell">
        <input
          className="m3x-time-picker__field"
          inputMode="numeric"
          value={pad(displayHour)}
          onChange={(e) => setHourText(e.target.value.slice(-2))}
          aria-label="Hour"
        />
        <span className="m3x-time-picker__label">Hour</span>
      </label>
      <span className="m3x-time-picker__separator" aria-hidden="true">
        :
      </span>
      <label className="m3x-time-picker__cell">
        <input
          className="m3x-time-picker__field"
          inputMode="numeric"
          value={pad(value.minute)}
          onChange={(e) => setMinuteText(e.target.value.slice(-2))}
          aria-label="Minute"
        />
        <span className="m3x-time-picker__label">Minute</span>
      </label>
      {hour12 && (
        <div className="m3x-time-picker__period" role="group" aria-label="AM or PM">
          {(['AM', 'PM'] as const).map((p) => (
            <button
              key={p}
              type="button"
              data-selected={period === p || undefined}
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
