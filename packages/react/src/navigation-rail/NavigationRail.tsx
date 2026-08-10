import * as React from 'react';
import { Icon, Ripple } from '@m3x/primitives';
import { Badge } from '../badge/Badge';
import type { NavigationBarItem } from '../navigation-bar/NavigationBar';

export interface NavigationRailProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: NavigationBarItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Expressive expanded rail: full-width rows with inline labels */
  expanded?: boolean;
  /** optional slot rendered above the items (menu button, FAB) */
  header?: React.ReactNode;
  'aria-label'?: string;
}

/**
 * M3 Expressive navigation rail — collapsed (96dp) or expanded (220dp).
 * Spec: specs/app-bars-navigation.md
 */
export function NavigationRail({
  items,
  value,
  defaultValue,
  onChange,
  expanded = false,
  header,
  className,
  ...rest
}: NavigationRailProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id ?? '');
  const selected = value ?? internal;

  return (
    <nav
      className={[
        'm3x-nav-rail',
        expanded ? 'm3x-nav-rail--expanded' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {header && <div className="m3x-nav-rail__header">{header}</div>}
      <div className="m3x-nav-rail__items">
        {items.map((item) => {
          const active = item.id === selected;
          const icon = (
            <Icon size={24} fill={active ? 1 : 0}>
              {item.icon}
            </Icon>
          );
          return (
            <button
              key={item.id}
              type="button"
              className="m3x-nav-rail__item m3x-focus-host"
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
              onClick={() => {
                if (value === undefined) setInternal(item.id);
                onChange?.(item.id);
              }}
            >
              <span className="m3x-nav-rail__pill">
                <Ripple />
                {item.badge === 'dot' ? (
                  <Badge>{icon}</Badge>
                ) : item.badge != null ? (
                  <Badge count={item.badge}>{icon}</Badge>
                ) : (
                  icon
                )}
                {expanded && <span className="m3x-nav-rail__inline-label">{item.label}</span>}
              </span>
              {!expanded && <span className="m3x-nav-rail__label">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
