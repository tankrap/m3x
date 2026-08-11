import * as React from 'react';
import { Icon } from '@tankmrap/m3x-primitives';

export interface SearchSuggestion {
  label: string;
  icon?: string;
  onSelect?: () => void;
}

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSelect' | 'size'> {
  /** trailing slot (mic icon button, avatar…) */
  trailing?: React.ReactNode;
  suggestions?: SearchSuggestion[];
  /** called when a suggestion is picked (after its own onSelect) */
  onSuggestionSelect?: (s: SearchSuggestion) => void;
  'aria-label'?: string;
}

/**
 * M3 search bar: full-round 56dp pill with docked suggestions.
 * Spec: specs/search-segmented-drawer-carousel.md
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { trailing, suggestions, onSuggestionSelect, className, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = React.useState(false);
  const showSuggestions = focused && (suggestions?.length ?? 0) > 0;

  return (
    <div
      className={[
        'm3x-search-bar',
        showSuggestions ? 'm3x-search-bar--open' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="m3x-search-bar__row">
        <Icon size={24} className="m3x-search-bar__leading">
          search
        </Icon>
        <input
          ref={ref}
          type="search"
          role="searchbox"
          className="m3x-search-bar__input"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            // allow suggestion click (pointerdown happens before blur)
            window.setTimeout(() => setFocused(false), 120);
            onBlur?.(e);
          }}
          {...rest}
        />
        {trailing && <div className="m3x-search-bar__trailing">{trailing}</div>}
      </div>
      {showSuggestions && (
        <ul className="m3x-search-bar__suggestions" role="listbox">
          {suggestions!.map((s, i) => (
            <li key={i} role="none">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="m3x-search-bar__suggestion"
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => {
                  s.onSelect?.();
                  onSuggestionSelect?.(s);
                  setFocused(false);
                }}
              >
                <Icon size={24}>{s.icon ?? 'history'}</Icon>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
