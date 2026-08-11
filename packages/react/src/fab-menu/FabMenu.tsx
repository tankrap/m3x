import * as React from 'react';
import { FocusRing, Icon, Ripple, useSpringValue, useSprings } from '@ibx34/m3x-primitives';
import type { FabColor, FabSize } from '../fab/Fab';

export interface FabMenuItem {
  label: string;
  icon: string;
  onSelect?: () => void;
}

export interface FabMenuProps {
  /** closed-state FAB icon (rotates 45° into a close affordance when open) */
  icon?: string;
  items: FabMenuItem[];
  size?: FabSize;
  color?: FabColor;
  'aria-label': string;
  className?: string;
}

const FAB_ICON_SIZES: Record<FabSize, number> = { baseline: 24, medium: 28, large: 36 };
const STAGGER_MS = 30;

/**
 * M3 Expressive FAB menu: the FAB morphs into a close affordance (primary
 * container, icon spins 45°) while large high-contrast pill items spring in
 * above it, staggered bottom-to-top. Spec: specs/fab-menu.md
 */
export function FabMenu({
  icon = 'add',
  items,
  size = 'baseline',
  color = 'primaryContainer',
  className,
  ...aria
}: FabMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [released, setReleased] = React.useState(0); // stagger counter, from bottom
  const rootRef = React.useRef<HTMLDivElement>(null);
  const fabRef = React.useRef<HTMLButtonElement>(null);
  const n = items.length;

  const iconRotation = useSpringValue(open ? 45 : 0, 'spatial', 'default');

  // stagger release bottom-to-top
  React.useEffect(() => {
    if (!open) {
      setReleased(0);
      return;
    }
    if (released >= n) return;
    const t = window.setTimeout(() => setReleased((r) => r + 1), released === 0 ? 0 : STAGGER_MS);
    return () => window.clearTimeout(t);
  }, [open, released, n]);

  // item i is rendered top-to-bottom; bottom (i = n-1) releases first
  const targets = items.map((_, i) => (open && n - 1 - i < released ? 1 : 0));
  const progress = useSprings(targets, 'spatial', 'default');

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const colorClass = {
    primaryContainer: 'primary-container',
    secondaryContainer: 'secondary-container',
    tertiaryContainer: 'tertiary-container',
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    surface: 'surface',
  }[color];

  return (
    <div className={['m3x-fab-menu', className].filter(Boolean).join(' ')} ref={rootRef}>
      <ul className="m3x-fab-menu__items" role="menu" hidden={!open && progress.every((p) => p < 0.01)}>
        {items.map((item, i) => {
          const p = progress[i] ?? 0;
          return (
            <li key={i} role="none">
              <button
                type="button"
                role="menuitem"
                tabIndex={open ? 0 : -1}
                className="m3x-fab-menu__item m3x-focus-host"
                style={{
                  transform: `translateY(${(1 - p) * 24}px) scale(${0.6 + 0.4 * p})`,
                  opacity: Math.min(1, Math.max(0, p * 1.4)),
                  pointerEvents: open ? undefined : 'none',
                }}
                onClick={() => {
                  setOpen(false);
                  fabRef.current?.focus();
                  item.onSelect?.();
                }}
              >
                <Ripple />
                <Icon size={24}>{item.icon}</Icon>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        ref={fabRef}
        type="button"
        className={['m3x-fab', `m3x-fab--${size}`, `m3x-fab--${colorClass}`, 'm3x-focus-host'].join(
          ' ',
        )}
        data-open={open || undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={aria['aria-label']}
        onClick={() => setOpen((o) => !o)}
      >
        <Ripple />
        <FocusRing />
        <Icon
          size={FAB_ICON_SIZES[size]}
          style={{ transform: `rotate(${iconRotation}deg)`, transition: 'none' }}
        >
          {icon}
        </Icon>
      </button>
    </div>
  );
}
