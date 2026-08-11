import * as React from 'react';
import { Icon, Ripple } from '@ibx34/m3x-primitives';

export interface MenuItemSpec {
  label: string;
  leadingIcon?: string;
  trailingIcon?: string;
  trailingText?: string;
  disabled?: boolean;
  divider?: boolean;
  onSelect?: () => void;
}

export interface MenuProps {
  open: boolean;
  onClose: () => void;
  items: MenuItemSpec[];
  /** the element the menu is anchored to; render Menu right after it inside a
   * position:relative wrapper */
  anchor?: 'bottom-start' | 'bottom-end';
  className?: string;
  'aria-label'?: string;
}

/**
 * M3 menu (Expressive container: 16dp corner, 8dp padding, level2).
 * Anchored inside a relative wrapper; Escape/outside-click close.
 * Spec: specs/app-bars-navigation.md
 */
export function Menu({ open, onClose, items, anchor = 'bottom-start', className, ...aria }: MenuProps) {
  const ref = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.parentElement?.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <ul
      ref={ref}
      role="menu"
      aria-label={aria['aria-label']}
      className={['m3x-menu', `m3x-menu--${anchor}`, className].filter(Boolean).join(' ')}
    >
      {items.map((item, i) =>
        item.divider ? (
          <li key={i} role="none" className="m3x-menu__divider" />
        ) : (
          <li key={i} role="none">
            <button
              type="button"
              role="menuitem"
              className="m3x-menu__item m3x-focus-host"
              disabled={item.disabled}
              onClick={() => {
                onClose();
                item.onSelect?.();
              }}
            >
              <Ripple disabled={item.disabled} />
              {item.leadingIcon && <Icon size={24} className="m3x-menu__icon">{item.leadingIcon}</Icon>}
              <span className="m3x-menu__label">{item.label}</span>
              {item.trailingText && <span className="m3x-menu__trailing-text">{item.trailingText}</span>}
              {item.trailingIcon && <Icon size={24} className="m3x-menu__icon">{item.trailingIcon}</Icon>}
            </button>
          </li>
        ),
      )}
    </ul>
  );
}
