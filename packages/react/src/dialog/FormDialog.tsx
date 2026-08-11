import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';
import { Button } from '../button/Button';

export interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  /** receives the native FormData; return false (or a rejected promise) to keep the dialog open */
  onSubmit: (data: FormData) => void | boolean | Promise<void | boolean>;
  icon?: string;
  headline: React.ReactNode;
  /** optional supporting text above the fields */
  description?: React.ReactNode;
  /** form fields (TextField, Select, Checkbox…) — give them `name`s */
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  /** disable submit (e.g. while validating externally) */
  submitDisabled?: boolean;
  className?: string;
}

/**
 * FormDialog: an M3 dialog wrapping a native <form> — fields stack in the
 * body, Enter submits, submit hands you the FormData. Extras component.
 */
export function FormDialog({
  open,
  onClose,
  onSubmit,
  icon,
  headline,
  description,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitDisabled = false,
  className,
}: FormDialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const result = await onSubmit(data);
      if (result !== false) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog
      ref={ref}
      className={['m3x-dialog', 'm3x-form-dialog', icon ? 'm3x-dialog--with-icon' : undefined, className]
        .filter(Boolean)
        .join(' ')}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <form className="m3x-dialog__content" onSubmit={handleSubmit}>
        {icon && (
          <Icon size={24} className="m3x-dialog__icon">
            {icon}
          </Icon>
        )}
        <h2 className="m3x-dialog__headline">{headline}</h2>
        <div className="m3x-dialog__body">
          {description && <p className="m3x-form-dialog__description">{description}</p>}
          <div className="m3x-form-dialog__fields">{children}</div>
        </div>
        <div className="m3x-dialog__actions">
          <Button variant="text" type="button" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="filled" type="submit" disabled={submitDisabled || busy}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
