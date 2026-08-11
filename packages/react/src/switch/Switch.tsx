import * as React from 'react';
import { Icon, Ripple, useSpringValue } from '@ibx34/m3x-primitives';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'> {
  /** show check/close icons inside the thumb */
  icons?: boolean;
  label?: React.ReactNode;
  /** track size: s 42×26, m 52×32 (default), l 62×38 */
  size?: 's' | 'm' | 'l';
}

/** thumb geometry from specs/selection-controls.md (base = m, 52×32 track) */
const THUMB_X = { unselected: 16, selected: 36 };
const THUMB_SIZE = { bare: 16, withIcon: 24, selected: 24, pressed: 28 };
const TRACK = { width: 52, height: 32 };
const SIZE_SCALE = { s: 0.8125, m: 1, l: 1.1875 } as const;

/**
 * M3 switch: 52×32 track, thumb springs position (`spatial.default`) and size
 * (`spatial.fast`, grows to 28dp while pressed). Native checkbox with
 * role="switch" underneath.
 * Spec: specs/selection-controls.md
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { icons = false, label, size = 'm', className, disabled, checked, defaultChecked, onChange, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current!);

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isChecked = checked ?? internalChecked;
  const [pressed, setPressed] = React.useState(false);
  const k = SIZE_SCALE[size];

  const thumbX = useSpringValue(
    (isChecked ? THUMB_X.selected : THUMB_X.unselected) * k,
    'spatial',
  );
  const thumbSize = useSpringValue(
    (pressed && !disabled
      ? THUMB_SIZE.pressed
      : isChecked
        ? THUMB_SIZE.selected
        : icons
          ? THUMB_SIZE.withIcon
          : THUMB_SIZE.bare) * k,
    'spatial',
    'fast',
  );

  const release = () => setPressed(false);

  return (
    <label
      className={['m3x-switch', disabled ? 'm3x-switch--disabled' : undefined, className]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      <span
        className="m3x-switch__track"
        data-selected={isChecked || undefined}
        style={size !== 'm' ? { width: TRACK.width * k, height: TRACK.height * k } : undefined}
      >
        <input
          ref={innerRef}
          type="checkbox"
          role="switch"
          className="m3x-switch__input"
          disabled={disabled}
          checked={checked}
          defaultChecked={checked === undefined ? defaultChecked : undefined}
          onChange={(e) => {
            if (checked === undefined) setInternalChecked(e.target.checked);
            onChange?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') setPressed(true);
          }}
          onKeyUp={release}
          {...rest}
        />
        <span
          className="m3x-switch__thumb-container"
          style={{ transform: `translateX(${thumbX - 16 * k}px)` }}
          aria-hidden="true"
        >
          <span className="m3x-switch__state-layer">
            <Ripple disabled={disabled} />
          </span>
          <span
            className="m3x-switch__thumb"
            data-selected={isChecked || undefined}
            style={{ width: thumbSize, height: thumbSize }}
          >
            {icons && (
              <Icon size={Math.round(16 * k)} className="m3x-switch__icon">
                {isChecked ? 'check' : 'close'}
              </Icon>
            )}
          </span>
        </span>
      </span>
      {label != null && <span className="m3x-switch__label">{label}</span>}
    </label>
  );
});
