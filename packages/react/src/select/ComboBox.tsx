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
 * pattern). Extras component.
 */
export function ComboBox({
  options,
  value,
  onValueChange,
  onSelect,
  filter = defaultFilter,
  openOnFocus = true,
  emptyMessage = 'No matches',
  ...fieldProps
}: ComboBoxProps) {
  const id = React.useId();
  const [internal, setInternal] = React.useState('');
  const text = value ?? internal;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const matches = text ? options.filter((o) => filter(o, text)) : options;

  const setText = (t: string) => {
    if (value === undefined) setInternal(t);
    onValueChange?.(t);
  };

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    setText(opt.label);
    onSelect?.(opt);
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

  React.useEffect(() => setActive(0), [text]);

  const onKeyDown = (e: React.KeyboardEvent) => {
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

  return (
    <div ref={rootRef} className="m3x-combobox" onKeyDown={onKeyDown}>
      <TextField
        {...fieldProps}
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
      {open && (
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
      )}
    </div>
  );
}
