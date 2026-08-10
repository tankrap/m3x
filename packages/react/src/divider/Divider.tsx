import * as React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** 16dp inset on both sides */
  inset?: boolean;
  vertical?: boolean;
}

/** M3 divider: 1dp outline-variant rule. Spec: specs/containment.md */
export function Divider({ inset = false, vertical = false, className, ...rest }: DividerProps) {
  return (
    <hr
      className={[
        'm3x-divider',
        inset ? 'm3x-divider--inset' : undefined,
        vertical ? 'm3x-divider--vertical' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-orientation={vertical ? 'vertical' : undefined}
      {...rest}
    />
  );
}
