import * as React from 'react';
import { useTheme } from '@ibx34/m3x-primitives';

/**
 * Animates a number toward `target` (ease-out), re-animating on every change.
 * Honors reduced motion by jumping instantly.
 */
export function useCountUp(target: number, duration = 400): number {
  const { reducedMotion } = useTheme();
  const [display, setDisplay] = React.useState(target);
  const fromRef = React.useRef(target);
  const raf = React.useRef(0);

  React.useEffect(() => {
    if (reducedMotion || duration <= 0) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const value = from + (target - from) * eased;
      setDisplay(value);
      fromRef.current = value;
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, reducedMotion]);

  return display;
}
