import * as React from 'react';
import { Icon } from '@m3x/primitives';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  variant?: 'filled' | 'outlined';
  disabled?: boolean;
  error?: boolean;
  supportingText?: string;
  className?: string;
}

/**
 * Select: a TextField-styled dropdown with full keyboard support (ARIA
 * combobox/listbox pattern, select-only). Extras component.
 */
export function Select({
  options,
  value,
  defaultValue = null,
  onChange,
  label,
  placeholder = '',
  variant = 'outlined',
  disabled = false,
  error = false,
  supportingText,
  className,
}: SelectProps) {
  const id = React.useId();
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === selected) ?? null;

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (value === undefined) setInternal(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      const idx = Math.max(0, options.findIndex((o) => o.value === selected));
      setActive(idx);
      listRef.current?.children[idx]?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [open, options, selected]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) return setOpen(true);
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        let next = active;
        do {
          next = (next + dir + options.length) % options.length;
        } while (options[next]?.disabled && next !== active);
        setActive(next);
        listRef.current?.children[next]?.scrollIntoView?.({ block: 'nearest' });
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) setOpen(true);
        else if (options[active]) commit(options[active]);
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const populated = selectedOption != null || placeholder !== '';

  return (
    <div
      ref={rootRef}
      className={[
        'm3x-select',
        `m3x-text-field`,
        `m3x-text-field--${variant}`,
        error ? 'm3x-text-field--error' : undefined,
        disabled ? 'm3x-text-field--disabled' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-populated={populated || open || undefined}
    >
      <button
        type="button"
        className="m3x-select__trigger m3x-text-field__container m3x-focus-host"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-labelledby={label ? `${id}-label` : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        {label && (
          <span id={`${id}-label`} className="m3x-text-field__label">
            {label}
          </span>
        )}
        <span className="m3x-select__value">
          {selectedOption?.icon && <Icon size={20}>{selectedOption.icon}</Icon>}
          {selectedOption?.label ?? (
            <span className="m3x-select__placeholder">{placeholder}</span>
          )}
        </span>
        <Icon size={24} className="m3x-select__arrow" data-open={open || undefined}>
          arrow_drop_down
        </Icon>
        {variant === 'outlined' && (
          <fieldset aria-hidden className="m3x-text-field__outline">
            <legend className="m3x-text-field__notch">
              {label ? <span>{label}</span> : null}
            </legend>
          </fieldset>
        )}
      </button>
      {open && (
        <ul id={`${id}-listbox`} ref={listRef} role="listbox" className="m3x-select__list">
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === selected}
              aria-disabled={opt.disabled || undefined}
              data-active={i === active || undefined}
              className="m3x-select__option"
              onPointerEnter={() => setActive(i)}
              onClick={() => commit(opt)}
            >
              {opt.icon && <Icon size={20}>{opt.icon}</Icon>}
              <span className="m3x-select__option-label">{opt.label}</span>
              {opt.value === selected && <Icon size={20}>check</Icon>}
            </li>
          ))}
        </ul>
      )}
      {supportingText && <span className="m3x-text-field__supporting">{supportingText}</span>}
    </div>
  );
}
