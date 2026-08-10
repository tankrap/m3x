import * as React from 'react';
import { Icon, Ripple } from '@m3x/primitives';

export interface SegmentSpec {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface SegmentedButtonsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  segments: SegmentSpec[];
  /** selected ids (controlled) */
  value?: string[];
  defaultValue?: string[];
  onChange?: (selected: string[]) => void;
  multiSelect?: boolean;
  'aria-label'?: string;
}

/**
 * M3 segmented buttons: 40dp outlined set, selected segments show a check on
 * secondary-container. Single (radio) or multi (checkbox) select.
 * Spec: specs/search-segmented-drawer-carousel.md
 */
export function SegmentedButtons({
  segments,
  value,
  defaultValue = [],
  onChange,
  multiSelect = false,
  className,
  ...rest
}: SegmentedButtonsProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const selected = value ?? internal;

  const toggle = (id: string) => {
    let next: string[];
    if (multiSelect) {
      next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    } else {
      next = selected.includes(id) ? [] : [id];
    }
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      className={['m3x-segmented', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={rest['aria-label']}
      {...rest}
    >
      {segments.map((seg) => {
        const isSelected = selected.includes(seg.id);
        return (
          <button
            key={seg.id}
            type="button"
            className="m3x-segmented__segment m3x-focus-host"
            data-selected={isSelected || undefined}
            aria-pressed={isSelected}
            disabled={seg.disabled}
            onClick={() => toggle(seg.id)}
          >
            <Ripple disabled={seg.disabled} />
            {isSelected ? (
              <Icon size={18} className="m3x-segmented__check">check</Icon>
            ) : (
              seg.icon && <Icon size={18}>{seg.icon}</Icon>
            )}
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
