import * as React from 'react';

export interface DockedToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** content arrangement */
  arrangement?: 'center' | 'space-between' | 'start';
}

/**
 * M3 Expressive docked toolbar — the bottom-app-bar replacement: full-width,
 * 64dp, surface-container. Spec: specs/toolbars.md
 */
export function DockedToolbar({
  children,
  arrangement = 'center',
  className,
  style,
  ...rest
}: DockedToolbarProps) {
  return (
    <div
      role="toolbar"
      className={['m3x-docked-toolbar', className].filter(Boolean).join(' ')}
      style={{ justifyContent: arrangement === 'space-between' ? 'space-between' : arrangement === 'start' ? 'flex-start' : 'center', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface FloatingToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  /** standard = surface-container; vibrant = primary-container */
  variant?: 'standard' | 'vibrant';
}

/** M3 Expressive floating toolbar: free-floating pill, standard or vibrant. */
export function FloatingToolbar({
  children,
  orientation = 'horizontal',
  variant = 'standard',
  className,
  ...rest
}: FloatingToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-orientation={orientation}
      className={[
        'm3x-floating-toolbar',
        `m3x-floating-toolbar--${orientation}`,
        `m3x-floating-toolbar--${variant}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
