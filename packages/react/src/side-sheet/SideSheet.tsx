import * as React from 'react';
import { IconButton } from '../icon-button/IconButton';

export interface SideSheetProps {
  title: React.ReactNode;
  children: React.ReactNode;
  /** modal: renders in a <dialog> docked to the trailing edge with scrim */
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
  /** panel width in px (min 256 per spec) */
  width?: number;
  className?: string;
}

/**
 * M3 side sheet — standing (in-flow trailing panel) or modal (native <dialog>,
 * slides from the trailing edge). Spec: specs/pickers-sheets.md
 */
export function SideSheet({
  title,
  children,
  modal = false,
  open = false,
  onClose,
  width = 400,
  className,
}: SideSheetProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    if (!modal) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [modal, open]);

  const content = (
    <>
      <div className="m3x-side-sheet__header">
        <span className="m3x-side-sheet__title">{title}</span>
        {(modal || onClose) && (
          <IconButton icon="close" aria-label="Close sheet" onClick={onClose} />
        )}
      </div>
      <div className="m3x-side-sheet__content">{children}</div>
    </>
  );

  if (modal) {
    return (
      <dialog
        ref={dialogRef}
        className={['m3x-side-sheet', 'm3x-side-sheet--modal', className].filter(Boolean).join(' ')}
        style={{ width }}
        onCancel={(e) => {
          e.preventDefault();
          onClose?.();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) onClose?.();
        }}
      >
        {content}
      </dialog>
    );
  }

  return (
    <aside
      className={['m3x-side-sheet', 'm3x-side-sheet--standing', className].filter(Boolean).join(' ')}
      style={{ width }}
    >
      {content}
    </aside>
  );
}
