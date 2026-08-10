import * as React from 'react';

export interface TooltipProps {
  /** tooltip text */
  content: string;
  children: React.ReactElement;
  /** show delay in ms (hover) */
  delay?: number;
}

/**
 * M3 plain tooltip: inverse-surface pill on hover (500ms delay) / focus.
 * Wraps its child in a positioning span and links via aria-describedby.
 * Spec: specs/app-bars-navigation.md
 */
export function Tooltip({ content, children, delay = 500 }: TooltipProps) {
  const id = React.useId();
  const [visible, setVisible] = React.useState(false);
  const timer = React.useRef(0);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(true), delay);
  };
  const showNow = () => {
    window.clearTimeout(timer.current);
    setVisible(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setVisible(false);
  };

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      className="m3x-tooltip__anchor"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={showNow}
      onBlur={hide}
    >
      {React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': id,
      })}
      <span role="tooltip" id={id} className="m3x-tooltip" data-visible={visible || undefined}>
        {content}
      </span>
    </span>
  );
}
