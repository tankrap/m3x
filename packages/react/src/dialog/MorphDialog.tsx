import * as React from 'react';
import { Icon, useSpringValue, useTheme } from '@ibx34/m3x-primitives';

export interface MorphDialogStep {
  id: string;
  icon?: string;
  headline: React.ReactNode;
  content: React.ReactNode;
  /** action buttons for this step */
  actions?: React.ReactNode;
  /** container width while this step is shown */
  width?: number;
}

export interface MorphDialogProps {
  open: boolean;
  onClose: () => void;
  steps: MorphDialogStep[];
  /** id of the visible step — changing it morphs the container */
  step: string;
  /** default container width */
  width?: number;
  className?: string;
}

const SWAP_MS = 190;

/** springs mount AT the first measured size (no grow-from-zero on open) */
function MorphViewport({
  w,
  h,
  instant,
  children,
}: {
  w: number;
  h: number;
  instant: boolean;
  children: React.ReactNode;
}) {
  const sw = useSpringValue(w, 'spatial', 'default');
  const sh = useSpringValue(h, 'spatial', 'default');
  return (
    <div
      className="m3x-morph-dialog__viewport"
      style={{ width: instant ? w : sw, height: instant ? h : sh }}
    >
      {children}
    </div>
  );
}

/**
 * MorphDialog: a dialog whose container spring-morphs (width + height) when
 * one step shifts into another, with the outgoing content lifting away and
 * the incoming content settling in — the Expressive container-transform feel.
 * Extras component.
 */
export function MorphDialog({
  open,
  onClose,
  steps,
  step,
  width = 360,
  className,
}: MorphDialogProps) {
  const { reducedMotion } = useTheme();
  const ref = React.useRef<HTMLDialogElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const current = steps.find((s) => s.id === step) ?? steps[0];
  const currentWidth = current?.width ?? width;

  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  const [leaving, setLeaving] = React.useState<MorphDialogStep | null>(null);
  const prevStepId = React.useRef(step);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // outgoing content overlays briefly while the container morphs
  React.useEffect(() => {
    if (prevStepId.current === step) return;
    const prev = steps.find((s) => s.id === prevStepId.current);
    prevStepId.current = step;
    if (!prev || reducedMotion) return;
    setLeaving(prev);
    const t = window.setTimeout(() => setLeaving(null), SWAP_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // measure the incoming step's natural size after paint — by then the
  // dialog's showModal() has run, so the hidden measurer has real layout
  React.useEffect(() => {
    if (!open) return;
    const el = measureRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.height > 0) setSize({ w: currentWidth, h: Math.ceil(rect.height) });
  }, [open, step, currentWidth, steps]);

  const renderStep = (s: MorphDialogStep, mode: 'live' | 'leaving' | 'measure') => (
    <div
      className={[
        'm3x-morph-dialog__step',
        mode === 'leaving' ? 'm3x-morph-dialog__step--leaving' : undefined,
        mode === 'live' && leaving && !reducedMotion ? 'm3x-morph-dialog__step--entering' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {s.icon && (
        <Icon size={24} className="m3x-dialog__icon">
          {s.icon}
        </Icon>
      )}
      <h2 className="m3x-dialog__headline">{s.headline}</h2>
      <div className="m3x-dialog__body">{s.content}</div>
      {s.actions && <div className="m3x-dialog__actions">{s.actions}</div>}
    </div>
  );

  if (!current) return null;

  return (
    <dialog
      ref={ref}
      className={['m3x-dialog', 'm3x-morph-dialog', current.icon ? 'm3x-dialog--with-icon' : undefined, className]
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
      {size ? (
        <MorphViewport w={size.w} h={size.h} instant={reducedMotion}>
          {leaving && !reducedMotion && renderStep(leaving, 'leaving')}
          {renderStep(current, 'live')}
        </MorphViewport>
      ) : (
        <div className="m3x-morph-dialog__viewport" style={{ width: currentWidth }}>
          {leaving && !reducedMotion && renderStep(leaving, 'leaving')}
          {renderStep(current, 'live')}
        </div>
      )}
      {/* hidden measurer: the incoming step at its target width */}
      <div
        ref={measureRef}
        className="m3x-morph-dialog__measure"
        style={{ width: currentWidth }}
        aria-hidden="true"
      >
        {renderStep(current, 'measure')}
      </div>
    </dialog>
  );
}
