import * as React from 'react';
import { Icon } from '@m3x/primitives';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectBaseProps {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  variant?: 'filled' | 'outlined';
  /** field frame size: s 40dp, m 56dp (default), l 64dp */
  size?: 's' | 'm' | 'l';
  disabled?: boolean;
  error?: boolean;
  supportingText?: string;
  className?: string;
}

interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  tags?: never;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
}

interface MultiSelectProps extends SelectBaseProps {
  multiple: true;
  /** render the selection as removable tag chips inside the field */
  tags?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

/**
 * Select: a TextField-styled dropdown (ARIA select-only combobox pattern) with
 * keyboard support, single or multi select, and optional tag rendering.
 * Extras component.
 */
export function Select(props: SelectProps) {
  const {
    options,
    label,
    placeholder = '',
    variant = 'outlined',
    size = 'm',
    disabled = false,
    error = false,
    supportingText,
    className,
  } = props;
  const multiple = props.multiple === true;
  const tags = multiple && props.tags === true;

  const id = React.useId();
  const [internal, setInternal] = React.useState<string[]>(() => {
    if (multiple) return (props.defaultValue as string[] | undefined) ?? [];
    const dv = (props as SingleSelectProps).defaultValue;
    return dv != null ? [dv] : [];
  });
  const controlled = props.value !== undefined;
  const selected: string[] = controlled
    ? multiple
      ? ((props.value as string[]) ?? [])
      : props.value != null
        ? [props.value as string]
        : []
    : internal;

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const emit = (next: string[]) => {
    if (!controlled) setInternal(next);
    if (multiple) (props.onChange as MultiSelectProps['onChange'])?.(next);
    else if (next[0] != null) (props.onChange as SingleSelectProps['onChange'])?.(next[0]);
  };

  const toggle = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (multiple) {
      emit(
        selected.includes(opt.value)
          ? selected.filter((v) => v !== opt.value)
          : [...selected, opt.value],
      );
      // multi-select stays open for further picks
    } else {
      emit([opt.value]);
      setOpen(false);
    }
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
      const idx = Math.max(0, options.findIndex((o) => selected.includes(o.value)));
      setActive(idx);
      listRef.current?.children[idx]?.scrollIntoView?.({ block: 'nearest' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
        else if (options[active]) toggle(options[active]);
        break;
      case 'Backspace':
        if (tags && selected.length > 0) emit(selected.slice(0, -1));
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const selectedOptions = options.filter((o) => selected.includes(o.value));
  const populated = selectedOptions.length > 0 || placeholder !== '';

  return (
    <div
      ref={rootRef}
      className={[
        'm3x-select',
        `m3x-text-field`,
        `m3x-text-field--${variant}`,
        `m3x-text-field--size-${size}`,
        tags ? 'm3x-select--tags' : undefined,
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
        <span className="m3x-text-field__content">
          {label && (
            <span id={`${id}-label`} className="m3x-text-field__label">
              {label}
            </span>
          )}
          <span className="m3x-select__value">
            {tags && selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <span key={opt.value} className="m3x-select__tag">
                  {opt.icon && <Icon size={16}>{opt.icon}</Icon>}
                  {opt.label}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={`Remove ${opt.label}`}
                    className="m3x-select__tag-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      emit(selected.filter((v) => v !== opt.value));
                    }}
                  >
                    <Icon size={14}>close</Icon>
                  </span>
                </span>
              ))
            ) : selectedOptions.length > 0 ? (
              <>
                {selectedOptions[0]!.icon && !multiple && (
                  <Icon size={20}>{selectedOptions[0]!.icon}</Icon>
                )}
                <span className="m3x-select__value-text">
                  {selectedOptions.map((o) => o.label).join(', ')}
                </span>
              </>
            ) : (
              <span className="m3x-select__placeholder">{placeholder}</span>
            )}
          </span>
        </span>
        <Icon size={24} className="m3x-select__arrow" data-open={open || undefined}>
          arrow_drop_down
        </Icon>
        {variant === 'outlined' && (
          <fieldset className="m3x-text-field__outline" aria-hidden="true">
            <legend className="m3x-text-field__notch">
              {label ? <span>{label}</span> : null}
            </legend>
          </fieldset>
        )}
        {variant === 'filled' && <span className="m3x-text-field__indicator" aria-hidden="true" />}
      </button>
      {open && (
        <ul
          id={`${id}-listbox`}
          ref={listRef}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          className="m3x-select__list"
        >
          {options.map((opt, i) => {
            const isSelected = selected.includes(opt.value);
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                data-active={i === active || undefined}
                className="m3x-select__option"
                onPointerEnter={() => setActive(i)}
                onClick={() => toggle(opt)}
              >
                {opt.icon && <Icon size={20}>{opt.icon}</Icon>}
                <span className="m3x-select__option-label">{opt.label}</span>
                {isSelected && <Icon size={20}>check</Icon>}
              </li>
            );
          })}
        </ul>
      )}
      {supportingText && <span className="m3x-text-field__supporting">{supportingText}</span>}
    </div>
  );
}
