import * as React from 'react';

export interface RichTooltipProps {
  subhead?: React.ReactNode;
  content: React.ReactNode;
  /** text buttons rendered at the bottom */
  actions?: React.ReactNode;
  children: React.ReactElement;
  /** persistent tooltips open on click and close on outside click/Escape */
  persistent?: boolean;
  delay?: number;
}

/**
 * M3 rich tooltip: surface-container card with subhead, supporting text and
 * optional actions; hover or persistent (click) modes.
 * Spec: specs/search-segmented-drawer-carousel.md
 */
export function RichTooltip({
  subhead,
  content,
  actions,
  children,
  persistent = false,
  delay = 500,
}: RichTooltipProps) {
  const id = React.useId();
  const [visible, setVisible] = React.useState(false);
  const timer = React.useRef(0);
  const rootRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  React.useEffect(() => {
    if (!persistent || !visible) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setVisible(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [persistent, visible]);

  const hoverHandlers = persistent
    ? {
        onClick: () => setVisible((v) => !v),
      }
    : {
        onPointerEnter: () => {
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setVisible(true), delay);
        },
        onPointerLeave: () => {
          window.clearTimeout(timer.current);
          setVisible(false);
        },
        onFocus: () => setVisible(true),
        onBlur: () => setVisible(false),
      };

  return (
    <span ref={rootRef} className="m3x-tooltip__anchor" {...hoverHandlers}>
      {React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': id,
      })}
      <span role="tooltip" id={id} className="m3x-rich-tooltip" data-visible={visible || undefined}>
        {subhead && <span className="m3x-rich-tooltip__subhead">{subhead}</span>}
        <span className="m3x-rich-tooltip__content">{content}</span>
        {actions && <span className="m3x-rich-tooltip__actions">{actions}</span>}
      </span>
    </span>
  );
}
