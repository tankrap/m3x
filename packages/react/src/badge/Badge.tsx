import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** count for the large badge; omit for the 6dp dot */
  count?: number;
  /** cap displayed count, shows "N+" beyond (default 999) */
  max?: number;
  /** wrap children (e.g. an icon) and pin the badge to its top-right */
  children?: React.ReactNode;
}

/**
 * M3 badge: 6dp error dot or 16dp counted pill, standalone or wrapping an
 * anchor element. Spec: specs/containment.md
 */
export function Badge({ count, max = 999, children, className, ...rest }: BadgeProps) {
  const label = count != null ? (count > max ? `${max}+` : String(count)) : null;
  const badge = (
    <span
      className={[
        'm3x-badge',
        label != null ? 'm3x-badge--large' : 'm3x-badge--dot',
        children ? 'm3x-badge--anchored' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {label}
    </span>
  );
  if (!children) return badge;
  return (
    <span className="m3x-badge__anchor">
      {children}
      {badge}
    </span>
  );
}
