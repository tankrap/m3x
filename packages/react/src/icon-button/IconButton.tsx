import * as React from 'react';
import { FocusRing, Icon, Ripple } from '@tankmrap/m3x-primitives';
import { ButtonShape, ButtonSize } from '../button/sizes';
import { chainHandlers, GroupPosition, usePressMorph } from '../button/usePressMorph';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';

const ICON_SIZES: Record<ButtonSize, number> = { xs: 20, s: 24, m: 24, l: 32, xl: 40 };

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children'> {
  /** Material Symbols icon name */
  icon: string;
  /** icon shown when selected (defaults to `icon` with FILL=1) */
  selectedIcon?: string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** toggle icon button (aria-pressed); selected flips shape + fills the icon */
  toggle?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** connected-group silhouette position (set by ButtonGroup/SplitButton) */
  groupPosition?: GroupPosition;
  /** accessible name — required, icon-only buttons have no text */
  'aria-label': string;
}

/**
 * M3 Expressive icon button: 4 color styles × 5 sizes × round/square with
 * press shape-morph; toggle animates shape + Material Symbols FILL axis.
 * Spec: specs/icon-button.md
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      selectedIcon,
      variant = 'standard',
      size = 's',
      shape = 'round',
      toggle = false,
      selected: selectedProp,
      defaultSelected = false,
      onSelectedChange,
      groupPosition,
      disabled = false,
      className,
      style,
      onClick,
      ...rest
    },
    ref,
  ) {
    const [selectedState, setSelectedState] = React.useState(defaultSelected);
    const selected = toggle ? selectedProp ?? selectedState : false;
    const { radius, handlers } = usePressMorph(size, shape, { selected, disabled, groupPosition });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (toggle) {
        const next = !selected;
        if (selectedProp === undefined) setSelectedState(next);
        onSelectedChange?.(next);
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={[
          'm3x-icon-button',
          `m3x-icon-button--${variant}`,
          `m3x-icon-button--${size}`,
          'm3x-focus-host',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ borderRadius: radius, ...style }}
        disabled={disabled}
        aria-pressed={toggle ? selected : undefined}
        data-selected={selected || undefined}
        onClick={handleClick}
        {...rest}
        onPointerDown={chainHandlers(handlers.onPointerDown, rest.onPointerDown)}
        onPointerUp={chainHandlers(handlers.onPointerUp, rest.onPointerUp)}
        onPointerLeave={chainHandlers(handlers.onPointerLeave, rest.onPointerLeave)}
        onPointerCancel={chainHandlers(handlers.onPointerCancel, rest.onPointerCancel)}
        onKeyDown={chainHandlers(handlers.onKeyDown, rest.onKeyDown)}
        onKeyUp={chainHandlers(handlers.onKeyUp, rest.onKeyUp)}
      >
        <Ripple disabled={disabled} />
        <FocusRing />
        <Icon size={ICON_SIZES[size]} fill={selected ? 1 : 0}>
          {selected && selectedIcon ? selectedIcon : icon}
        </Icon>
      </button>
    );
  },
);
