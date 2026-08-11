import * as React from 'react';

export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** show the value label while dragging/focused */
  valueLabel?: boolean | ((value: number) => React.ReactNode);
  /** Expressive track size: xs 16dp (default), s 24dp, m 40dp, l 56dp */
  size?: 'xs' | 's' | 'm' | 'l';
  'aria-label'?: string;
}

/**
 * M3 Expressive slider: 16dp track, 4×44dp handle with 6dp track gaps, stop
 * indicator, press-narrowed handle, value label. A full-size native
 * `<input type="range">` provides pointer/keyboard/AT behavior.
 * Spec: specs/slider.md
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value: valueProp,
    defaultValue,
    onChange,
    valueLabel = true,
    size = 'xs',
    className,
    disabled,
    style,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = React.useState(defaultValue ?? min);
  const value = valueProp ?? internal;
  const [dragging, setDragging] = React.useState(false);

  const pct = max > min ? (value - min) / (max - min) : 0;
  const label =
    typeof valueLabel === 'function' ? valueLabel(value) : valueLabel ? Math.round(value * 100) / 100 : null;

  const stop = () => setDragging(false);

  return (
    <div
      className={[
        'm3x-slider',
        size !== 'xs' ? `m3x-slider--size-${size}` : undefined,
        disabled ? 'm3x-slider--disabled' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--_pct': pct, ...style } as React.CSSProperties}
      data-dragging={dragging || undefined}
      data-at-max={pct >= 0.995 || undefined}
      data-at-min={pct <= 0.005 || undefined}
    >
      <input
        ref={ref}
        type="range"
        className="m3x-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (valueProp === undefined) setInternal(v);
          onChange?.(v);
        }}
        onPointerDown={() => !disabled && setDragging(true)}
        onPointerUp={stop}
        onPointerCancel={stop}
        onBlur={stop}
        {...rest}
      />
      <div className="m3x-slider__track m3x-slider__track--active" aria-hidden="true" />
      <div className="m3x-slider__track m3x-slider__track--inactive" aria-hidden="true">
        <span className="m3x-slider__stop" />
      </div>
      <div className="m3x-slider__handle" aria-hidden="true">
        {label != null && (
          <span className="m3x-slider__value-label" role="presentation">
            {label}
          </span>
        )}
      </div>
    </div>
  );
});
