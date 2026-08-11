import * as React from 'react';
import { Icon, Ripple, useSpringValue } from '@tankmrap/m3x-primitives';
import { Badge } from '../badge/Badge';

export interface NavigationBarItem {
  id: string;
  label: React.ReactNode;
  icon: string;
  badge?: number | 'dot';
}

export interface NavigationBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: NavigationBarItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
}

function NavItem({
  item,
  active,
  onSelect,
}: {
  item: NavigationBarItem;
  active: boolean;
  onSelect: () => void;
}) {
  const pillWidth = useSpringValue(active ? 64 : 32, 'spatial', 'default');
  const icon = (
    <Icon size={24} fill={active ? 1 : 0}>
      {item.icon}
    </Icon>
  );
  return (
    <button
      type="button"
      className="m3x-nav-bar__item m3x-focus-host"
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={onSelect}
    >
      <span className="m3x-nav-bar__icon-area">
        <span
          className="m3x-nav-bar__pill"
          aria-hidden="true"
          style={{ width: pillWidth, opacity: active ? 1 : 0 }}
        />
        <span className="m3x-nav-bar__icon">
          {item.badge === 'dot' ? (
            <Badge>{icon}</Badge>
          ) : item.badge != null ? (
            <Badge count={item.badge}>{icon}</Badge>
          ) : (
            icon
          )}
        </span>
        <Ripple />
      </span>
      <span className="m3x-nav-bar__label">{item.label}</span>
    </button>
  );
}

/**
 * M3 navigation bar (Expressive): 80dp bar, active pill indicator grows in,
 * Material Symbols fill on activation, badge support.
 * Spec: specs/tabs-navigation.md
 */
export function NavigationBar({
  items,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: NavigationBarProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id ?? '');
  const selected = value ?? internal;

  return (
    <nav className={['m3x-nav-bar', className].filter(Boolean).join(' ')} {...rest}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          active={item.id === selected}
          onSelect={() => {
            if (value === undefined) setInternal(item.id);
            onChange?.(item.id);
          }}
        />
      ))}
    </nav>
  );
}
