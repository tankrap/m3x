import * as React from 'react';
import { Ripple, useSprings } from '@tankmrap/m3x-primitives';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  /** controlled selected tab id */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
}

/**
 * M3 primary tabs: content-width 3dp indicator that springs between tabs
 * (`spatial.default`), arrow-key roving focus.
 * Spec: specs/tabs-navigation.md
 */
export function Tabs({ tabs, value, defaultValue, onChange, className, ...rest }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? tabs[0]?.id ?? '');
  const selected = value ?? internal;
  const selectedIndex = Math.max(0, tabs.findIndex((t) => t.id === selected));

  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [metrics, setMetrics] = React.useState<{ x: number; w: number }[]>([]);

  React.useLayoutEffect(() => {
    const els = tabRefs.current.slice(0, tabs.length);
    const measure = () =>
      setMetrics(
        els.map((el) => {
          if (!el) return { x: 0, w: 0 };
          const label = el.querySelector('.m3x-tabs__label') as HTMLElement | null;
          const lw = label?.offsetWidth ?? el.offsetWidth;
          return { x: el.offsetLeft + (el.offsetWidth - lw) / 2, w: lw };
        }),
      );
    measure();
    const ro = new ResizeObserver(measure);
    els.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [tabs.length]);

  const target = metrics[selectedIndex] ?? { x: 0, w: 0 };
  const [ix, iw] = useSprings([target.x, target.w], 'spatial', 'default');

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const enabled = tabs.filter((t) => !t.disabled);
    const cur = enabled.findIndex((t) => t.id === selected);
    const next =
      enabled[(cur + (e.key === 'ArrowRight' ? 1 : enabled.length - 1)) % enabled.length]!;
    select(next.id);
    tabRefs.current[tabs.indexOf(next)]?.focus();
  };

  return (
    <div className={['m3x-tabs', className].filter(Boolean).join(' ')} {...rest}>
      <div className="m3x-tabs__list" role="tablist" aria-label={rest['aria-label']} onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={tab.id === selected}
            tabIndex={tab.id === selected ? 0 : -1}
            disabled={tab.disabled}
            className="m3x-tabs__tab m3x-focus-host"
            data-selected={tab.id === selected || undefined}
            onClick={() => select(tab.id)}
          >
            <Ripple disabled={tab.disabled} />
            <span className="m3x-tabs__label">{tab.label}</span>
          </button>
        ))}
        {metrics.length > 0 && (
          <span
            className="m3x-tabs__indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${ix}px)`, width: `${Math.max(0, iw ?? 0)}px` }}
          />
        )}
      </div>
    </div>
  );
}
