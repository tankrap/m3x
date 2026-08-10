import * as React from 'react';
import { Icon, Ripple } from '@m3x/primitives';
import { Badge } from '../badge/Badge';

export interface DrawerItemSpec {
  id: string;
  label: string;
  icon?: string;
  badge?: number | 'dot' | string;
  /** renders a section headline instead of an item */
  headline?: boolean;
  divider?: boolean;
}

interface DrawerContentProps {
  items: DrawerItemSpec[];
  selected: string;
  onSelect: (id: string) => void;
}

function DrawerContent({ items, selected, onSelect }: DrawerContentProps) {
  return (
    <div className="m3x-drawer__items">
      {items.map((item, i) => {
        if (item.divider) return <hr key={i} className="m3x-drawer__divider" />;
        if (item.headline)
          return (
            <div key={i} className="m3x-drawer__headline">
              {item.label}
            </div>
          );
        const active = item.id === selected;
        return (
          <button
            key={item.id}
            type="button"
            className="m3x-drawer__item m3x-focus-host"
            data-active={active || undefined}
            aria-current={active ? 'page' : undefined}
            onClick={() => onSelect(item.id)}
          >
            <Ripple />
            {item.icon && <Icon size={24} fill={active ? 1 : 0}>{item.icon}</Icon>}
            <span className="m3x-drawer__label">{item.label}</span>
            {typeof item.badge === 'number' ? (
              <Badge count={item.badge} />
            ) : item.badge === 'dot' ? (
              <Badge />
            ) : item.badge != null ? (
              <span className="m3x-drawer__badge-text">{item.badge}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export interface NavigationDrawerProps {
  items: DrawerItemSpec[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** modal: renders in a <dialog> with scrim; requires `open`/`onClose` */
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * M3 navigation drawer — standing (in-flow sheet) or modal (native <dialog>,
 * slides from the start edge, 28dp trailing corners).
 * Spec: specs/search-segmented-drawer-carousel.md
 */
export function NavigationDrawer({
  items,
  value,
  defaultValue,
  onChange,
  modal = false,
  open = false,
  onClose,
  className,
  ...aria
}: NavigationDrawerProps) {
  const firstItem = items.find((i) => !i.headline && !i.divider);
  const [internal, setInternal] = React.useState(defaultValue ?? firstItem?.id ?? '');
  const selected = value ?? internal;
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const handleSelect = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
    if (modal) onClose?.();
  };

  React.useEffect(() => {
    if (!modal) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [modal, open]);

  if (modal) {
    return (
      <dialog
        ref={dialogRef}
        className={['m3x-drawer', 'm3x-drawer--modal', className].filter(Boolean).join(' ')}
        aria-label={aria['aria-label']}
        onCancel={(e) => {
          e.preventDefault();
          onClose?.();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) onClose?.();
        }}
      >
        <DrawerContent items={items} selected={selected} onSelect={handleSelect} />
      </dialog>
    );
  }

  return (
    <nav
      className={['m3x-drawer', 'm3x-drawer--standing', className].filter(Boolean).join(' ')}
      aria-label={aria['aria-label']}
    >
      <DrawerContent items={items} selected={selected} onSelect={handleSelect} />
    </nav>
  );
}
