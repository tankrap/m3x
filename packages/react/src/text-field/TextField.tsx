import * as React from 'react';
import { Icon } from '@tankmrap/m3x-primitives';

export type FieldSize = 's' | 'm' | 'l';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  variant?: 'filled' | 'outlined';
  /** field frame size: s 40dp, m 56dp (default), l 64dp */
  size?: FieldSize;
  label: string;
  supportingText?: string;
  error?: boolean;
  /** error message shown as supporting text when `error` (overrides supportingText) */
  errorText?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  onTrailingIconClick?: () => void;
  prefix?: string;
  suffix?: string;
}

/**
 * M3 text field, filled + outlined, full anatomy: floating label (outlined
 * notch via fieldset/legend), supporting text, error state, leading/trailing
 * icons, prefix/suffix. Spec: specs/text-field.md
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    variant = 'filled',
    size = 'm',
    label,
    supportingText,
    error = false,
    errorText,
    leadingIcon,
    trailingIcon,
    onTrailingIconClick,
    prefix,
    suffix,
    className,
    disabled,
    id: idProp,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref,
) {
  const reactId = React.useId();
  const id = idProp ?? `m3x-tf-${reactId}`;
  const supportId = `${id}-support`;

  const [internalValue, setInternalValue] = React.useState(String(defaultValue ?? ''));
  const currentValue = value !== undefined ? String(value) : internalValue;
  const populated = currentValue.length > 0;

  const support = error && errorText ? errorText : supportingText;

  return (
    <div
      className={[
        'm3x-text-field',
        `m3x-text-field--${variant}`,
        `m3x-text-field--size-${size}`,
        error ? 'm3x-text-field--error' : undefined,
        disabled ? 'm3x-text-field--disabled' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-populated={populated || undefined}
    >
      <div className="m3x-text-field__container">
        {leadingIcon && (
          <Icon size={24} className="m3x-text-field__leading">
            {leadingIcon}
          </Icon>
        )}
        <div className="m3x-text-field__content">
          <label className="m3x-text-field__label" htmlFor={id}>
            {label}
          </label>
          <div className="m3x-text-field__input-row">
            {prefix && <span className="m3x-text-field__affix">{prefix}</span>}
            <input
              ref={ref}
              id={id}
              className="m3x-text-field__input"
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={support ? supportId : undefined}
              value={value}
              defaultValue={value === undefined ? defaultValue : undefined}
              onChange={(e) => {
                if (value === undefined) setInternalValue(e.target.value);
                onChange?.(e);
              }}
              {...rest}
            />
            {suffix && <span className="m3x-text-field__affix">{suffix}</span>}
          </div>
        </div>
        {trailingIcon &&
          (onTrailingIconClick ? (
            <button
              type="button"
              className="m3x-text-field__trailing m3x-text-field__trailing--button"
              onClick={onTrailingIconClick}
              disabled={disabled}
              aria-label={`${label}: action`}
            >
              <Icon size={24}>{trailingIcon}</Icon>
            </button>
          ) : (
            <Icon size={24} className="m3x-text-field__trailing">
              {trailingIcon}
            </Icon>
          ))}
        {variant === 'outlined' && (
          <fieldset className="m3x-text-field__outline" aria-hidden="true">
            <legend className="m3x-text-field__notch">
              <span>{label}</span>
            </legend>
          </fieldset>
        )}
        {variant === 'filled' && <div className="m3x-text-field__indicator" aria-hidden="true" />}
      </div>
      {support && (
        <div className="m3x-text-field__supporting" id={supportId}>
          {support}
        </div>
      )}
    </div>
  );
});
