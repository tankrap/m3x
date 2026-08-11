import * as React from 'react';
import { useCountUp } from './useCountUp';

export interface ChartHeaderSpec {
  /** resting caption, e.g. "Earned so far" */
  label: React.ReactNode;
  /** resting headline number; defaults to the data total */
  value?: number;
  format?: (value: number) => React.ReactNode;
  /** chip/extra rendered beside the number while resting */
  trailing?: React.ReactNode;
}

interface ChartHeaderProps {
  spec: ChartHeaderSpec;
  restingValue: number;
  active: { label: React.ReactNode; value: number } | null;
}

/**
 * BoardUI-style chart header: caption + big count-up numeral that swap to the
 * hovered datum. Internal to the chart extras.
 */
export function ChartHeader({ spec, restingValue, active }: ChartHeaderProps) {
  const target = active ? active.value : (spec.value ?? restingValue);
  const display = useCountUp(target);
  const format = spec.format ?? ((v: number) => Math.round(v).toLocaleString());

  return (
    <div className="m3x-chart-header">
      <span className="m3x-chart-header__label">{active ? active.label : spec.label}</span>
      <span className="m3x-chart-header__row">
        <span className="m3x-chart-header__value">{format(display)}</span>
        {spec.trailing && (
          <span
            className="m3x-chart-header__trailing"
            style={active ? { visibility: 'hidden' } : undefined}
          >
            {spec.trailing}
          </span>
        )}
      </span>
    </div>
  );
}

/** shared hook: track the hovered slot index from pointer x */
export function useActiveIndex(
  count: number,
  toIndex: (offsetX: number) => number,
  onActiveChange?: (index: number | null) => void,
) {
  const [active, setActive] = React.useState<number | null>(null);
  const prevRef = React.useRef<number | null>(null);

  const update = (next: number | null) => {
    if (prevRef.current !== next) {
      prevRef.current = next;
      setActive(next);
      onActiveChange?.(next);
    }
  };

  const onPointerMove = (e: { currentTarget: Element; clientX: number }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = toIndex(e.clientX - rect.left);
    update(i >= 0 && i < count ? i : null);
  };

  const onPointerLeave = () => update(null);

  // mouse fallbacks keep this working where PointerEvent is unavailable
  return { active, onPointerMove, onPointerLeave, onMouseMove: onPointerMove, onMouseLeave: onPointerLeave };
}

/** two-pass mount flag for CSS-transition entrance animations */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}
