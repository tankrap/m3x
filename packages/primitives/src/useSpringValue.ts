import * as React from 'react';
import type { SpringToken } from '@m3x/tokens';
import { animateSpring, AnimationHandle } from './spring';
import { useTheme, MotionFamily, MotionSpeed } from './ThemeProvider';

/**
 * Spring-animate toward `target` using a motion token from the current theme.
 * Retargeting mid-flight preserves velocity (springs chain seamlessly).
 * Under `prefers-reduced-motion`, spatial values jump instantly.
 */
export function useSpringValue(
  target: number,
  family: MotionFamily = 'spatial',
  speed: MotionSpeed = 'default',
): number {
  const { spring, reducedMotion } = useTheme();
  const [value, setValue] = React.useState(target);
  const stateRef = React.useRef({ value: target, velocity: 0 });
  const handleRef = React.useRef<AnimationHandle | null>(null);
  const instant = reducedMotion && family === 'spatial';

  React.useEffect(() => {
    if (instant || stateRef.current.value === target) {
      handleRef.current?.stop();
      handleRef.current = null;
      stateRef.current = { value: target, velocity: 0 };
      setValue(target);
      return;
    }
    const prev = handleRef.current?.stop();
    const from = prev ? prev.value : stateRef.current.value;
    const velocity = prev ? prev.velocity : stateRef.current.velocity;
    handleRef.current = animateSpring(spring(family, speed), from, target, velocity, (s) => {
      stateRef.current = s;
      setValue(s.value);
    });
    return () => {
      const last = handleRef.current?.stop();
      if (last) stateRef.current = last;
      handleRef.current = null;
    };
  }, [target, family, speed, spring, instant]);

  return instant ? target : value;
}
