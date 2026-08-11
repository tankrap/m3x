import * as React from 'react';
import { Ripple } from '@ibx34/m3x-primitives';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** control size: s 16dp, m 20dp (default), l 24dp ring */
  size?: 's' | 'm' | 'l';
}

/**
 * M3 radio button: 20dp ring, 10dp dot scales in. Native input underneath.
 * Spec: specs/selection-controls.md
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, size = 'm', className, disabled, ...rest },
  ref,
) {
  return (
    <label
      className={[
        'm3x-radio',
        `m3x-selection--${size}`,
        disabled ? 'm3x-radio--disabled' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="m3x-radio__target">
        <input ref={ref} type="radio" className="m3x-radio__input" disabled={disabled} {...rest} />
        <span className="m3x-radio__state-layer">
          <Ripple disabled={disabled} />
        </span>
        <span className="m3x-radio__ring" aria-hidden="true">
          <span className="m3x-radio__dot" />
        </span>
      </span>
      {label != null && <span className="m3x-radio__label">{label}</span>}
    </label>
  );
});
