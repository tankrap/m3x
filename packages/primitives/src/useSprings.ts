import * as React from 'react';
import { animateSpring, AnimationHandle, SpringState } from './spring';
import { useTheme, MotionFamily, MotionSpeed } from './ThemeProvider';

/**
 * Spring-animate an array of values toward `targets` (one spring per slot,
 * shared token). Retargeting any slot mid-flight preserves its velocity.
 * Array length may change between renders; new slots start at their target.
 * Under reduced motion, spatial values jump instantly.
 */
export function useSprings(
  targets: readonly number[],
  family: MotionFamily = 'spatial',
  speed: MotionSpeed = 'default',
): number[] {
  const { spring, reducedMotion } = useTheme();
  const instant = reducedMotion && family === 'spatial';

  const statesRef = React.useRef<SpringState[]>([]);
  const handlesRef = React.useRef<(AnimationHandle | null)[]>([]);
  const [, forceRender] = React.useReducer((x: number) => x + 1, 0);

  // keep refs sized to targets; new slots snap to target
  if (statesRef.current.length !== targets.length) {
    statesRef.current = targets.map(
      (t, i) => statesRef.current[i] ?? { value: t, velocity: 0, done: true },
    );
    handlesRef.current.slice(targets.length).forEach((h) => h?.stop());
    handlesRef.current = targets.map((_, i) => handlesRef.current[i] ?? null);
  }

  const key = targets.join(',');
  React.useEffect(() => {
    if (instant) {
      handlesRef.current.forEach((h) => h?.stop());
      statesRef.current = targets.map((t) => ({ value: t, velocity: 0, done: true }));
      forceRender();
      return;
    }
    targets.forEach((target, i) => {
      const current = statesRef.current[i]!;
      if (current.value === target && current.done) return;
      const prev = handlesRef.current[i]?.stop();
      const from = prev ? prev.value : current.value;
      const velocity = prev ? prev.velocity : current.velocity;
      handlesRef.current[i] = animateSpring(spring(family, speed), from, target, velocity, (s) => {
        statesRef.current[i] = s;
        forceRender();
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, family, speed, spring, instant]);

  React.useEffect(
    () => () => {
      handlesRef.current.forEach((h) => h?.stop());
    },
    [],
  );

  return instant ? [...targets] : statesRef.current.map((s) => s.value);
}
