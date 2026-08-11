import * as React from 'react';
import { Ripple } from '@ibx34/m3x-primitives';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** shows the 2dp dash instead of a check */
  indeterminate?: boolean;
  error?: boolean;
  /** visible label text rendered after the control */
  label?: React.ReactNode;
  /** control size: s 15dp, m 18dp (default), l 22dp box */
  size?: 's' | 'm' | 'l';
}

/**
 * M3 checkbox: 18dp container, draw-in check, indeterminate + error states.
 * Wraps a native input for full form/keyboard/AT semantics.
 * Spec: specs/selection-controls.md
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate = false, error = false, label, size = 'm', className, disabled, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current!);

  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={[
        'm3x-checkbox',
        `m3x-selection--${size}`,
        error ? 'm3x-checkbox--error' : undefined,
        disabled ? 'm3x-checkbox--disabled' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="m3x-checkbox__target">
        <input
          ref={innerRef}
          type="checkbox"
          className="m3x-checkbox__input"
          disabled={disabled}
          aria-invalid={error || undefined}
          {...rest}
        />
        <span className="m3x-checkbox__state-layer">
          <Ripple disabled={disabled} />
        </span>
        <span className="m3x-checkbox__box" aria-hidden="true">
          <svg viewBox="0 0 18 18" className="m3x-checkbox__mark">
            {indeterminate ? (
              <path d="M4 9H14" className="m3x-checkbox__dash" />
            ) : (
              <path d="M3.5 9.5L7 13L14.5 5.5" className="m3x-checkbox__check" />
            )}
          </svg>
        </span>
      </span>
      {label != null && <span className="m3x-checkbox__label">{label}</span>}
    </label>
  );
});
