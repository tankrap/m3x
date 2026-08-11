import * as React from 'react';
import { Icon, Ripple } from '@ibx34/m3x-primitives';
import { Badge } from '../badge/Badge';
import { Tooltip } from '../tooltip/Tooltip';

export interface SidebarItemSpec {
  id: string;
  label: string;
  icon?: string;
  badge?: number | 'dot' | string;
  disabled?: boolean;
  /** nested items — the row becomes a collapsible group */
  children?: SidebarItemSpec[];
}

export interface SidebarSectionSpec {
  /** section heading; omit for an unlabeled group */
  title?: string;
  items: SidebarItemSpec[];
}

export interface SidebarProps {
  sections: SidebarSectionSpec[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** icon-only rail mode (labels move into tooltips) */
  collapsed?: boolean;
  /** slot above the sections (workspace switcher, search…) */
  header?: React.ReactNode;
  /** pinned to the bottom (profile, settings…) */
  footer?: React.ReactNode;
  width?: number;
  className?: string;
  'aria-label'?: string;
}

function flatIds(items: SidebarItemSpec[]): string[] {
  return items.flatMap((i) => [i.id, ...(i.children ? flatIds(i.children) : [])]);
}

/**
 * Desktop sidebar: sectioned navigation with nested collapsible groups,
 * badges, header/footer slots, and an icon-only collapsed mode.
 * Extras component.
 */
export function Sidebar({
  sections,
  value,
  defaultValue,
  onChange,
  collapsed = false,
  header,
  footer,
  width = 260,
  className,
  ...aria
}: SidebarProps) {
  const firstId = sections[0]?.items[0]?.id ?? '';
  const [internal, setInternal] = React.useState(defaultValue ?? firstId);
  const selected = value ?? internal;
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(() => {
    // groups containing the selection start open
    const open = new Set<string>();
    for (const section of sections) {
      for (const item of section.items) {
        if (item.children && flatIds(item.children).includes(selected)) open.add(item.id);
      }
    }
    return open;
  });

  const pick = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const renderItem = (item: SidebarItemSpec, depth: number) => {
    const isGroup = (item.children?.length ?? 0) > 0;
    const isOpen = openGroups.has(item.id);
    const active = item.id === selected;
    const groupActive = isGroup && !isOpen && flatIds(item.children!).includes(selected);

    const row = (
      <button
        key={item.id}
        type="button"
        className="m3x-sidebar__item m3x-focus-host"
        data-active={active || groupActive || undefined}
        data-depth={depth || undefined}
        aria-current={active ? 'page' : undefined}
        aria-expanded={isGroup ? isOpen : undefined}
        disabled={item.disabled}
        onClick={() => {
          if (isGroup) {
            setOpenGroups((prev) => {
              const next = new Set(prev);
              if (next.has(item.id)) next.delete(item.id);
              else next.add(item.id);
              return next;
            });
          } else {
            pick(item.id);
          }
        }}
      >
        <Ripple disabled={item.disabled} />
        {item.icon ? (
          <Icon size={20} fill={active ? 1 : 0} className="m3x-sidebar__icon">
            {item.icon}
          </Icon>
        ) : (
          <span className="m3x-sidebar__icon" />
        )}
        {!collapsed && <span className="m3x-sidebar__label">{item.label}</span>}
        {!collapsed && typeof item.badge === 'number' ? (
          <Badge count={item.badge} />
        ) : !collapsed && item.badge === 'dot' ? (
          <Badge />
        ) : !collapsed && item.badge != null ? (
          <span className="m3x-sidebar__badge-text">{item.badge}</span>
        ) : null}
        {!collapsed && isGroup && (
          <Icon size={18} className="m3x-sidebar__chevron" data-open={isOpen || undefined}>
            expand_more
          </Icon>
        )}
      </button>
    );

    return (
      <React.Fragment key={item.id}>
        {collapsed && !isGroup ? (
          <Tooltip content={item.label} delay={300}>
            {row}
          </Tooltip>
        ) : (
          row
        )}
        {isGroup && isOpen && !collapsed && (
          <div className="m3x-sidebar__group" role="group">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <nav
      className={['m3x-sidebar', collapsed ? 'm3x-sidebar--collapsed' : undefined, className]
        .filter(Boolean)
        .join(' ')}
      style={{ width: collapsed ? 68 : width }}
      aria-label={aria['aria-label'] ?? 'Sidebar'}
    >
      {header && <div className="m3x-sidebar__header">{header}</div>}
      <div className="m3x-sidebar__sections">
        {sections.map((section, si) => (
          <div key={si} className="m3x-sidebar__section">
            {section.title && !collapsed && (
              <div className="m3x-sidebar__section-title">{section.title}</div>
            )}
            {section.title && collapsed && si > 0 && <hr className="m3x-sidebar__rule" />}
            {section.items.map((item) => renderItem(item, 0))}
          </div>
        ))}
      </div>
      {footer && <div className="m3x-sidebar__footer">{footer}</div>}
    </nav>
  );
}
