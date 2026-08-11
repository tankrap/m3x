import * as React from 'react';
import { FocusRing, Icon, Ripple } from '@ibx34/m3x-primitives';

export type FabSize = 'baseline' | 'medium' | 'large';
/** Expressive color styles (audited 2026-08-09): container styles are the
 * defaults; vibrant primary/secondary/tertiary are new; surface is legacy
 * ("no longer recommended" per spec). */
export type FabColor =
  | 'primaryContainer'
  | 'secondaryContainer'
  | 'tertiaryContainer'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'surface';

const FAB_ICON_SIZES: Record<FabSize, number> = { baseline: 24, medium: 28, large: 36 };

const COLOR_CLASS: Record<FabColor, string> = {
  primaryContainer: 'primary-container',
  secondaryContainer: 'secondary-container',
  tertiaryContainer: 'tertiary-container',
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  surface: 'surface',
};

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: FabSize;
  color?: FabColor;
  'aria-label': string;
}

/**
 * M3 Expressive FAB — baseline/medium/large, five color options, elevation
 * level3 (hover level4). Spec: specs/fab.md
 */
export const Fab = React.forwardRef<HTMLButtonElement, FabProps>(function Fab(
  { icon, size = 'baseline', color = 'primaryContainer', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={[
        'm3x-fab',
        `m3x-fab--${size}`,
        `m3x-fab--${COLOR_CLASS[color]}`,
        'm3x-focus-host',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <Ripple disabled={rest.disabled} />
      <FocusRing />
      <Icon size={FAB_ICON_SIZES[size]}>{icon}</Icon>
    </button>
  );
});

export interface ExtendedFabProps extends FabProps {
  children: React.ReactNode;
  /** collapse to icon-only (width morph animates via CSS grid trick) */
  collapsed?: boolean;
}

/** Extended FAB with label; `collapsed` morphs down to the icon-only FAB. */
export const ExtendedFab = React.forwardRef<HTMLButtonElement, ExtendedFabProps>(
  function ExtendedFab(
    { icon, size = 'baseline', color = 'primaryContainer', collapsed = false, className, children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          'm3x-fab',
          'm3x-fab--extended',
          `m3x-fab--${size}`,
          `m3x-fab--${COLOR_CLASS[color]}`,
          'm3x-focus-host',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        data-collapsed={collapsed || undefined}
        {...rest}
      >
        <Ripple disabled={rest.disabled} />
        <FocusRing />
        <Icon size={FAB_ICON_SIZES[size]}>{icon}</Icon>
        <span className="m3x-fab__label-clip" aria-hidden={collapsed || undefined}>
          <span className="m3x-fab__label">{children}</span>
        </span>
      </button>
    );
  },
);
