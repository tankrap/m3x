import * as React from 'react';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** hide the drag handle */
  handle?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * M3 modal bottom sheet on the native <dialog>: 28dp top corners, drag handle,
 * scrim; swipe-to-dismiss deferred (Esc / scrim click / handle click close).
 * Spec: specs/app-bars-navigation.md
 */
export function BottomSheet({
  open,
  onClose,
  children,
  handle = true,
  className,
  ...aria
}: BottomSheetProps) {
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
      className={['m3x-bottom-sheet', className].filter(Boolean).join(' ')}
      aria-label={aria['aria-label']}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {handle && (
        <button
          type="button"
          className="m3x-bottom-sheet__handle"
          aria-label="Close sheet"
          onClick={onClose}
        />
      )}
      <div className="m3x-bottom-sheet__content">{children}</div>
    </dialog>
  );
}
