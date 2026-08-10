import * as React from 'react';
import { Icon, Ripple } from '@m3x/primitives';

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
  return (
    <label
      className={['m3x-selection-card', className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
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
      <span className="m3x-selection-card__surface">
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
