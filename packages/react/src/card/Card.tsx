import * as React from 'react';
import { FocusRing, Ripple } from '@ibx34/m3x-primitives';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** interactive cards render state layer/ripple/focus ring and are focusable */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

/**
 * M3 card: elevated / filled / outlined, 12dp corner; interactive when given
 * an onClick. Spec: specs/containment.md
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'elevated', onClick, className, children, ...rest },
  ref,
) {
  const interactive = onClick != null;
  return (
    <div
      ref={ref}
      className={[
        'm3x-card',
        `m3x-card--${variant}`,
        interactive ? 'm3x-card--interactive m3x-focus-host' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      {...(interactive
        ? {
            role: 'button',
            tabIndex: 0,
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                (e.currentTarget as HTMLElement).click();
              }
            },
          }
        : {})}
      {...rest}
    >
      {interactive && <Ripple />}
      {interactive && <FocusRing />}
      {children}
    </div>
  );
});
