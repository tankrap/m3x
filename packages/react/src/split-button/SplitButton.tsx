import * as React from 'react';
import { FocusRing, Icon, Ripple, useSpringValue } from '@m3x/primitives';
import { Button, ButtonVariant } from '../button/Button';
import { ButtonSize, BUTTON_SIZES } from '../button/sizes';
import { chainHandlers, usePressMorph } from '../button/usePressMorph';

export interface SplitButtonMenuItem {
  label: string;
  icon?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** leading action */
  children: React.ReactNode;
  icon?: string;
  onAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  items: SplitButtonMenuItem[];
  disabled?: boolean;
  className?: string;
  /** accessible name for the trailing menu button */
  menuLabel?: string;
}

/**
 * M3 Expressive split button: leading action + trailing menu button sharing a
 * connected silhouette. Opening the menu morphs the trailing container to
 * fully rounded and spins the chevron 180° (springy). Spec: specs/split-button.md
 */
export function SplitButton({
  variant = 'filled',
  size = 's',
  children,
  icon,
  onAction,
  items,
  disabled = false,
  className,
  menuLabel = 'More options',
}: SplitButtonProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const trailingRef = React.useRef<HTMLButtonElement>(null);

  const { radius, handlers } = usePressMorph(size, 'round', {
    selected: open,
    disabled,
    groupPosition: 'last',
  });
  const chevronRotation = useSpringValue(open ? 180 : 0, 'spatial', 'default');
  const spec = BUTTON_SIZES[size];

  // outside click + Escape close
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trailingRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={['m3x-split-button', className].filter(Boolean).join(' ')} ref={rootRef}>
      <Button
        variant={variant}
        size={size}
        icon={icon}
        groupPosition="first"
        disabled={disabled}
        onClick={onAction}
      >
        {children}
      </Button>
      <button
        ref={trailingRef}
        type="button"
        className={[
          'm3x-button',
          `m3x-button--${variant}`,
          `m3x-button--${size}`,
          'm3x-split-button__trailing',
          'm3x-focus-host',
        ].join(' ')}
        style={{ borderRadius: radius }}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={menuLabel}
        onClick={() => setOpen((o) => !o)}
        onPointerDown={handlers.onPointerDown}
        onPointerUp={handlers.onPointerUp}
        onPointerLeave={handlers.onPointerLeave}
        onPointerCancel={handlers.onPointerCancel}
        onKeyDown={chainHandlers(handlers.onKeyDown, undefined)}
        onKeyUp={handlers.onKeyUp}
      >
        <Ripple disabled={disabled} />
        <FocusRing />
        <Icon
          size={spec.iconSize}
          style={{ transform: `rotate(${chevronRotation}deg)`, transition: 'none' }}
        >
          keyboard_arrow_down
        </Icon>
      </button>
      {open && (
        <ul className="m3x-split-button__menu" role="menu">
          {items.map((item, i) => (
            <li key={i} role="none">
              <button
                type="button"
                role="menuitem"
                className="m3x-split-button__menu-item m3x-focus-host"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  trailingRef.current?.focus();
                  item.onSelect?.();
                }}
              >
                <Ripple disabled={item.disabled} />
                {item.icon && <Icon size={24}>{item.icon}</Icon>}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
