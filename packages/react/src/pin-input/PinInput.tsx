import * as React from 'react';

export interface PinInputProps {
  /** number of characters (default 6) */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** fires once when every box is filled */
  onComplete?: (value: string) => void;
  /** restrict input: numeric (default) or any character */
  mode?: 'numeric' | 'alphanumeric';
  /** render dots instead of characters */
  mask?: boolean;
  /** visual gap after this many boxes (e.g. 3 → "123 456") */
  groupSize?: number;
  size?: 's' | 'm' | 'l';
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  'aria-label'?: string;
}

const BOX = { s: { w: 36, h: 44, font: 18 }, m: { w: 48, h: 56, font: 24 }, l: { w: 56, h: 64, font: 28 } };

/**
 * PinInput: one box per character (OTP-style). Typing advances, Backspace
 * retreats, arrows navigate, and pasting distributes across the boxes.
 * Extras component.
 */
export function PinInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  mode = 'numeric',
  mask = false,
  groupSize,
  size = 'm',
  error = false,
  disabled = false,
  autoFocus = false,
  className,
  ...aria
}: PinInputProps) {
  const [internal, setInternal] = React.useState(defaultValue.slice(0, length));
  const chars = (value ?? internal).slice(0, length);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const completed = React.useRef(false);
  const dims = BOX[size];

  const sanitize = (text: string) =>
    (mode === 'numeric' ? text.replace(/\D/g, '') : text.replace(/\s/g, '')).slice(0, length);

  const commit = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
    if (next.length === length && !completed.current) {
      completed.current = true;
      onComplete?.(next);
    } else if (next.length < length) {
      completed.current = false;
    }
  };

  const focusBox = (i: number) => {
    const clamped = Math.max(0, Math.min(length - 1, i));
    inputRefs.current[clamped]?.focus();
    inputRefs.current[clamped]?.select();
  };

  const handleInput = (i: number, raw: string) => {
    const text = sanitize(raw);
    if (!text) return;
    // insert starting at box i (covers typing and multi-char paste/autofill)
    const next = (chars.slice(0, i) + text + chars.slice(i + text.length)).slice(0, length);
    commit(next);
    focusBox(i + text.length);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace': {
        e.preventDefault();
        if (chars[i]) {
          commit(chars.slice(0, i) + chars.slice(i + 1));
        } else if (i > 0) {
          commit(chars.slice(0, i - 1) + chars.slice(i));
          focusBox(i - 1);
        }
        break;
      }
      case 'ArrowLeft':
        e.preventDefault();
        focusBox(i - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusBox(i + 1);
        break;
    }
  };

  const handlePaste = (i: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    handleInput(i, e.clipboardData.getData('text'));
  };

  return (
    <div
      className={[
        'm3x-pin-input',
        error ? 'm3x-pin-input--error' : undefined,
        disabled ? 'm3x-pin-input--disabled' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-label={aria['aria-label'] ?? 'PIN input'}
    >
      {Array.from({ length }, (_, i) => (
        <React.Fragment key={i}>
          {groupSize != null && i > 0 && i % groupSize === 0 && (
            <span className="m3x-pin-input__separator" aria-hidden="true" />
          )}
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            className="m3x-pin-input__box"
            style={{ width: dims.w, height: dims.h, fontSize: dims.font }}
            type={mask ? 'password' : 'text'}
            inputMode={mode === 'numeric' ? 'numeric' : 'text'}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && i === 0}
            maxLength={length} /* allow paste/autofill of the full code */
            value={chars[i] ?? ''}
            disabled={disabled}
            aria-label={`Character ${i + 1} of ${length}`}
            data-filled={chars[i] ? true : undefined}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.target.select()}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
