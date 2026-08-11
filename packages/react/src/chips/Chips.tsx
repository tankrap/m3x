import * as React from 'react';
import { FocusRing, Icon, Ripple } from '@tankmrap/m3x-primitives';

/* Shared chip chrome — specs/chips.md */

interface ChipBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  children: React.ReactNode;
}

const chipClasses = (kind: string, extra?: (string | undefined | false)[]) =>
  ['m3x-chip', `m3x-chip--${kind}`, 'm3x-focus-host', ...(extra ?? [])].filter(Boolean).join(' ');

/** Assist chip: a compact contextual action. */
export const AssistChip = React.forwardRef<HTMLButtonElement, ChipBaseProps>(function AssistChip(
  { icon, children, className, ...rest },
  ref,
) {
  return (
    <button ref={ref} type="button" className={chipClasses('assist', [className])} {...rest}>
      <Ripple disabled={rest.disabled} />
      <FocusRing />
      {icon && <Icon size={18} className="m3x-chip__icon m3x-chip__icon--primary">{icon}</Icon>}
      <span className="m3x-chip__label">{children}</span>
    </button>
  );
});

export interface FilterChipProps extends ChipBaseProps {
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

/** Filter chip: toggle; selected swaps to secondary-container with a check. */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  { icon, children, className, selected: selectedProp, defaultSelected = false, onSelectedChange, onClick, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState(defaultSelected);
  const selected = selectedProp ?? internal;
  return (
    <button
      ref={ref}
      type="button"
      className={chipClasses('filter', [className])}
      aria-pressed={selected}
      data-selected={selected || undefined}
      onClick={(e) => {
        if (selectedProp === undefined) setInternal(!selected);
        onSelectedChange?.(!selected);
        onClick?.(e);
      }}
      {...rest}
    >
      <Ripple disabled={rest.disabled} />
      <FocusRing />
      {selected ? (
        <Icon size={18} className="m3x-chip__icon m3x-chip__check">check</Icon>
      ) : (
        icon && <Icon size={18} className="m3x-chip__icon">{icon}</Icon>
      )}
      <span className="m3x-chip__label">{children}</span>
    </button>
  );
});

export interface InputChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: string;
  children: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

/** Input chip: represents user input with a remove affordance. */
export const InputChip = React.forwardRef<HTMLSpanElement, InputChipProps>(function InputChip(
  { icon, children, onRemove, removeLabel = 'Remove', className, disabled, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={chipClasses('input', [className, disabled ? 'm3x-chip--disabled' : undefined])}
      {...rest}
    >
      {icon && <Icon size={18} className="m3x-chip__icon">{icon}</Icon>}
      <span className="m3x-chip__label">{children}</span>
      <button
        type="button"
        className="m3x-chip__remove m3x-focus-host"
        aria-label={`${removeLabel}: ${typeof children === 'string' ? children : ''}`}
        disabled={disabled}
        onClick={onRemove}
      >
        <Icon size={18}>close</Icon>
      </button>
    </span>
  );
});

/** Suggestion chip: a suggested query/reply. */
export const SuggestionChip = React.forwardRef<HTMLButtonElement, ChipBaseProps>(
  function SuggestionChip({ icon, children, className, ...rest }, ref) {
    return (
      <button ref={ref} type="button" className={chipClasses('suggestion', [className])} {...rest}>
        <Ripple disabled={rest.disabled} />
        <FocusRing />
        {icon && <Icon size={18} className="m3x-chip__icon">{icon}</Icon>}
        <span className="m3x-chip__label">{children}</span>
      </button>
    );
  },
);
