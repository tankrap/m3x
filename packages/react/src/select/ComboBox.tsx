import * as React from 'react';
import { Icon } from '@m3x/primitives';
import { TextField, TextFieldProps } from '../text-field/TextField';
import type { SelectOption } from './Select';

export interface ComboBoxProps
  extends Omit<
    TextFieldProps,
    'value' | 'onChange' | 'defaultValue' | 'trailingIcon' | 'onTrailingIconClick' | 'onSelect'
  > {
  options: SelectOption[];
  /** input text (controlled) */
  value?: string;
  onValueChange?: (text: string) => void;
  /** fires when an option is chosen */
  onSelect?: (option: SelectOption) => void;
  /** multi-select: chosen options render as removable tag chips in the field */
  multiple?: boolean;
  /** selected values (multi mode, controlled) */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (values: string[]) => void;
  /** custom filter; default: case-insensitive substring on label */
  filter?: (option: SelectOption, query: string) => boolean;
  /** show all options when the query is empty (default true) */
  openOnFocus?: boolean;
  emptyMessage?: string;
}

const defaultFilter = (o: SelectOption, q: string) =>
  o.label.toLowerCase().includes(q.toLowerCase());

/**
 * ComboBox: TextField + filtered autocomplete listbox (ARIA 1.2 combobox
 * pattern). `multiple` turns it into a tag input: picking adds a chip, the
 * query resets, Backspace on an empty query removes the last tag.
 * Extras component.
 */
export function ComboBox({
  options,
  value,
  onValueChange,
  onSelect,
  multiple = false,
  selected,
  defaultSelected = [],
  onSelectedChange,
  filter = defaultFilter,
  openOnFocus = true,
  emptyMessage = 'No matches',
  label,
  variant = 'outlined',
  size = 'm',
  disabled,
  error,
  supportingText,
  ...fieldProps
}: ComboBoxProps) {
  const id = React.useId();
  const [internalText, setInternalText] = React.useState('');
  const text = value ?? internalText;
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
  const chosen = selected ?? internalSelected;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const available = multiple ? options.filter((o) => !chosen.includes(o.value)) : options;
  const matches = text ? available.filter((o) => filter(o, text)) : available;
  const chosenOptions = options.filter((o) => chosen.includes(o.value));

  const setText = (t: string) => {
    if (value === undefined) setInternalText(t);
    onValueChange?.(t);
  };

  const setChosen = (next: string[]) => {
    if (selected === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  };

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (multiple) {
      setChosen([...chosen, opt.value]);
      setText('');
      onSelect?.(opt);
      inputRef.current?.focus();
    } else {
      setText(opt.label);
      onSelect?.(opt);
      setOpen(false);
    }
  };

  const removeTag = (valueToRemove: string) => {
    setChosen(chosen.filter((v) => v !== valueToRemove));
    inputRef.current?.focus();
  };

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  React.useEffect(() => setActive(0), [text]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && multiple && text === '' && chosen.length > 0) {
      setChosen(chosen.slice(0, -1));
      return;
    }
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(a + 1, matches.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case 'Enter':
        if (matches[active]) {
          e.preventDefault();
          commit(matches[active]);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const listbox = open && (
    <ul id={`${id}-listbox`} role="listbox" className="m3x-select__list">
      {matches.length === 0 && <li className="m3x-combobox__empty">{emptyMessage}</li>}
      {matches.map((opt, i) => (
        <li
          key={opt.value}
          role="option"
          aria-selected={false}
          aria-disabled={opt.disabled || undefined}
          data-active={i === active || undefined}
          className="m3x-select__option"
          onPointerEnter={() => setActive(i)}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => commit(opt)}
        >
          {opt.icon && <Icon size={20}>{opt.icon}</Icon>}
          <span className="m3x-select__option-label">{opt.label}</span>
        </li>
      ))}
    </ul>
  );

  if (multiple) {
    const populated = chosenOptions.length > 0 || text.length > 0;
    return (
      <div
        ref={rootRef}
        className={[
          'm3x-combobox',
          'm3x-select--tags',
          'm3x-text-field',
          `m3x-text-field--${variant}`,
          `m3x-text-field--size-${size}`,
          error ? 'm3x-text-field--error' : undefined,
          disabled ? 'm3x-text-field--disabled' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        data-open={open || undefined}
        data-populated={populated || undefined}
        onKeyDown={onKeyDown}
      >
        <div
          className="m3x-text-field__container"
          onClick={() => {
            inputRef.current?.focus();
            if (openOnFocus) setOpen(true);
          }}
        >
          <span className="m3x-text-field__content">
            {label && <span className="m3x-text-field__label">{label}</span>}
            <span className="m3x-select__value">
              {chosenOptions.map((opt) => (
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
                      removeTag(opt.value);
                    }}
                  >
                    <Icon size={14}>close</Icon>
                  </span>
                </span>
              ))}
              <input
                ref={inputRef}
                className="m3x-combobox__tag-input"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-listbox`}
                aria-autocomplete="list"
                aria-label={label}
                disabled={disabled}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => openOnFocus && setOpen(true)}
              />
            </span>
          </span>
          {variant === 'outlined' && (
            <fieldset className="m3x-text-field__outline" aria-hidden="true">
              <legend className="m3x-text-field__notch">
                {label ? <span>{label}</span> : null}
              </legend>
            </fieldset>
          )}
          {variant === 'filled' && (
            <span className="m3x-text-field__indicator" aria-hidden="true" />
          )}
        </div>
        {listbox}
        {supportingText && <span className="m3x-text-field__supporting">{supportingText}</span>}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="m3x-combobox"
      data-open={open || undefined}
      onKeyDown={onKeyDown}
    >
      <TextField
        {...fieldProps}
        label={label}
        variant={variant}
        size={size}
        disabled={disabled}
        error={error}
        supportingText={supportingText}
        ref={inputRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => openOnFocus && setOpen(true)}
        trailingIcon={open ? 'arrow_drop_up' : 'arrow_drop_down'}
        onTrailingIconClick={() => setOpen((o) => !o)}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
      />
      {listbox}
    </div>
  );
}
