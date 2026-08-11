import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  icon?: string;
  headline: React.ReactNode;
  children?: React.ReactNode;
  /** action buttons (usually text Buttons); rendered right-aligned */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * M3 basic dialog on the native <dialog> element (top layer, focus trap, Esc).
 * Spec: specs/containment.md
 */
export function Dialog({ open, onClose, icon, headline, children, actions, className }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={['m3x-dialog', icon ? 'm3x-dialog--with-icon' : undefined, className]
        .filter(Boolean)
        .join(' ')}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // scrim click closes (clicks on the backdrop hit the dialog element itself)
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby={undefined}
    >
      <div className="m3x-dialog__content">
        {icon && (
          <Icon size={24} className="m3x-dialog__icon">
            {icon}
          </Icon>
        )}
        <h2 className="m3x-dialog__headline">{headline}</h2>
        {children && <div className="m3x-dialog__body">{children}</div>}
        {actions && <div className="m3x-dialog__actions">{actions}</div>}
      </div>
    </dialog>
  );
}
