import * as React from 'react';
import { Icon, Ripple } from '@m3x/primitives';

export interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  /** show a close icon */
  closeIcon?: boolean;
  /** auto-dismiss ms; 0 disables */
  autoHideDuration?: number;
  className?: string;
}

/**
 * M3 snackbar: inverse-surface bar, optional action + close, auto-dismiss.
 * Spec: specs/containment.md
 */
export function Snackbar({
  open,
  onClose,
  message,
  actionLabel,
  onAction,
  closeIcon = false,
  autoHideDuration = 5000,
  className,
}: SnackbarProps) {
  React.useEffect(() => {
    if (!open || !autoHideDuration) return;
    const t = window.setTimeout(onClose, autoHideDuration);
    return () => window.clearTimeout(t);
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;
  return (
    <div
      className={['m3x-snackbar', className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className="m3x-snackbar__message">{message}</span>
      {actionLabel && (
        <button
          type="button"
          className="m3x-snackbar__action m3x-focus-host"
          onClick={() => {
            onAction?.();
            onClose();
          }}
        >
          <Ripple />
          {actionLabel}
        </button>
      )}
      {closeIcon && (
        <button
          type="button"
          className="m3x-snackbar__close m3x-focus-host"
          aria-label="Dismiss"
          onClick={onClose}
        >
          <Ripple />
          <Icon size={24}>close</Icon>
        </button>
      )}
    </div>
  );
}
