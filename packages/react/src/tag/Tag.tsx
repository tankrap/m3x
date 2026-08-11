import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';

export type TagColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: TagColor;
  icon?: string;
  /** leading status dot instead of an icon */
  dot?: boolean;
  size?: 's' | 'm';
  children: React.ReactNode;
}

/**
 * Tag: a small tonal status label for tables, cards and lists — colored with
 * the theme's (extended) container roles. Extras component.
 */
export function Tag({
  color = 'neutral',
  icon,
  dot = false,
  size = 'm',
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span
      className={[
        'm3x-tag',
        `m3x-tag--${color}`,
        size === 's' ? 'm3x-tag--s' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {dot && <span className="m3x-tag__dot" aria-hidden="true" />}
      {icon && !dot && <Icon size={size === 's' ? 14 : 16}>{icon}</Icon>}
      {children}
    </span>
  );
}
