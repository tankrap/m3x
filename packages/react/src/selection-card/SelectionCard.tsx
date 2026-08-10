import * as React from 'react';
import { animateSpring, AnimationHandle, Icon, Ripple, useTheme } from '@m3x/primitives';

const REST_RADIUS = 12;
const PRESSED_RADIUS = 24;

export interface SelectionCardProps {
  /** wraps a native checkbox (multi) or radio (single, give a shared `name`) */
  mode?: 'checkbox' | 'radio';
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * SelectionCard: a card-sized checkbox/radio with icon, title and description —
 * the "choose a plan" pattern. Extras component.
 */
export function SelectionCard({
  mode = 'checkbox',
  name,
  value,
  checked,
  defaultChecked,
  onCheckedChange,
  icon,
  title,
  description,
  disabled = false,
  className,
}: SelectionCardProps) {
  const { spring, reducedMotion } = useTheme();
  const surfaceRef = React.useRef<HTMLSpanElement>(null);
  const animRef = React.useRef<AnimationHandle | null>(null);
  const radiusRef = React.useRef(REST_RADIUS);

  // Expressive press morph: corners spring 12dp → 24dp while pressed
  const morphTo = (target: number, fast: boolean) => {
    if (disabled || reducedMotion) return;
    const prev = animRef.current?.stop();
    const from = radiusRef.current;
    animRef.current = animateSpring(
      spring('spatial', fast ? 'fast' : 'default'),
      0,
      1,
      prev?.done === false ? prev.velocity : 0,
      (s) => {
        radiusRef.current = from + (target - from) * s.value;
        if (surfaceRef.current) {
          surfaceRef.current.style.borderRadius = `${radiusRef.current.toFixed(2)}px`;
        }
      },
    );
  };

  React.useEffect(() => () => void animRef.current?.stop(), []);

  return (
    <label
      className={['m3x-selection-card', className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      onPointerDown={() => morphTo(PRESSED_RADIUS, true)}
      onPointerUp={() => morphTo(REST_RADIUS, false)}
      onPointerLeave={() => morphTo(REST_RADIUS, false)}
      onPointerCancel={() => morphTo(REST_RADIUS, false)}
    >
      <input
        type={mode}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="m3x-selection-card__input"
      />
      <span ref={surfaceRef} className="m3x-selection-card__surface">
        <Ripple disabled={disabled} />
        {icon && (
          <Icon size={28} className="m3x-selection-card__icon">
            {icon}
          </Icon>
        )}
        <span className="m3x-selection-card__text">
          <span className="m3x-selection-card__title">{title}</span>
          {description && (
            <span className="m3x-selection-card__description">{description}</span>
          )}
        </span>
        <Icon size={22} className="m3x-selection-card__check" fill={1}>
          check_circle
        </Icon>
      </span>
    </label>
  );
}
