import * as React from 'react';
import { Icon } from '@m3x/primitives';
import { IconButton } from '../icon-button/IconButton';
import type { SearchSuggestion } from './SearchBar';

export interface SearchViewProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (s: SearchSuggestion) => void;
  /** custom results area rendered below the input row */
  children?: React.ReactNode;
  'aria-label'?: string;
}

/**
 * M3 full-screen search view: back arrow + input + clear, suggestion list or
 * custom results. Built on the native <dialog>.
 * Spec: specs/search-segmented-drawer-carousel.md
 */
export function SearchView({
  open,
  onClose,
  value,
  onChange,
  placeholder = 'Search',
  suggestions,
  onSuggestionSelect,
  children,
  ...aria
}: SearchViewProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="m3x-search-view"
      aria-label={aria['aria-label'] ?? 'Search'}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="m3x-search-view__bar">
        <IconButton icon="arrow_back" aria-label="Back" onClick={onClose} />
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          className="m3x-search-view__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <IconButton icon="close" aria-label="Clear search" onClick={() => onChange('')} />
        )}
      </div>
      <div className="m3x-search-view__results">
        {children ??
          (suggestions && (
            <ul role="listbox" className="m3x-search-view__list">
              {suggestions.map((s, i) => (
                <li key={i} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    className="m3x-search-bar__suggestion"
                    onClick={() => {
                      s.onSelect?.();
                      onSuggestionSelect?.(s);
                    }}
                  >
                    <Icon size={24}>{s.icon ?? 'history'}</Icon>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </dialog>
  );
}
