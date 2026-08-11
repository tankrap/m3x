import * as React from 'react';
import { FocusRing, Icon, Ripple } from '@tankmrap/m3x-primitives';
import { ButtonShape, ButtonSize, BUTTON_SIZES } from './sizes';
import { chainHandlers, GroupPosition, usePressMorph } from './usePressMorph';

export type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** resting shape; press spring-morphs toward the other shape */
  shape?: ButtonShape;
  /** Material Symbols icon name (leading), or pass any node via `iconNode` */
  icon?: string;
  iconNode?: React.ReactNode;
  /** render as toggle button (aria-pressed) */
  toggle?: boolean;
  /** controlled selected state (toggle) */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** connected-group silhouette position (set by ButtonGroup/SplitButton) */
  groupPosition?: GroupPosition;
  children?: React.ReactNode;
}

/**
 * M3 Expressive common button: 5 color styles × 5 sizes × round/square shape,
 * with the press shape-morph and optional toggle behavior.
 * Spec: specs/button.md
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'filled',
    size = 's',
    shape = 'round',
    icon,
    iconNode,
    toggle = false,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    groupPosition,
    disabled = false,
    className,
    style,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const [selectedState, setSelectedState] = React.useState(defaultSelected);
  const selected = toggle ? selectedProp ?? selectedState : false;

  const { radius, handlers } = usePressMorph(size, shape, { selected, disabled, groupPosition });
  const spec = BUTTON_SIZES[size];

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
        'm3x-button',
        `m3x-button--${variant}`,
        `m3x-button--${size}`,
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
      {icon ? <Icon size={spec.iconSize}>{icon}</Icon> : iconNode}
      {children != null && <span className="m3x-button__label">{children}</span>}
    </button>
  );
});
