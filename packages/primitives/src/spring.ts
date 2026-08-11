/**
 * Closed-form damped spring solver — the library's entire motion engine (~1KB).
 * Parameterized only by the motion tokens (dampingRatio/stiffness, mass = 1),
 * matching Compose's physics so `motionScheme` switching retunes everything.
 */
import type { SpringToken } from '@tankmrap/m3x-tokens';

export interface SpringState {
  value: number;
  velocity: number;
  done: boolean;
}

export interface SpringSolver {
  /** state at time t (seconds since start) */
  at(t: number): SpringState;
}

const REST_DELTA = 0.01;
const REST_VELOCITY = 0.01;

/**
 * Analytic solution of x'' = -k(x - target) - c x' with c = 2ζ√k.
 * Handles under-damped (ζ<1) and critically damped (ζ≥1 treated as critical —
 * M3 tokens never exceed 1).
 */
export function createSpring(
  token: SpringToken,
  from: number,
  to: number,
  initialVelocity = 0,
): SpringSolver {
  const { dampingRatio: zeta, stiffness } = token;
  const w0 = Math.sqrt(stiffness); // natural frequency
  const x0 = from - to;
  const v0 = initialVelocity;
  const scale = Math.max(Math.abs(x0), Math.abs(to - from), 1);

  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const A = x0;
    const B = (v0 + zeta * w0 * x0) / wd;
    return {
      at(t) {
        const decay = Math.exp(-zeta * w0 * t);
        const cos = Math.cos(wd * t);
        const sin = Math.sin(wd * t);
        const x = decay * (A * cos + B * sin);
        const dx =
          -zeta * w0 * x + decay * (-A * wd * sin + B * wd * cos);
        const done =
          Math.abs(x) < REST_DELTA * scale && Math.abs(dx) < REST_VELOCITY * scale * w0;
        return { value: to + (done ? 0 : x), velocity: done ? 0 : dx, done };
      },
    };
  }

  // critically damped
  const A = x0;
  const B = v0 + w0 * x0;
  return {
    at(t) {
      const decay = Math.exp(-w0 * t);
      const x = decay * (A + B * t);
      const dx = decay * (B - w0 * (A + B * t));
      const done =
        Math.abs(x) < REST_DELTA * scale && Math.abs(dx) < REST_VELOCITY * scale * w0;
      return { value: to + (done ? 0 : x), velocity: done ? 0 : dx, done };
    },
  };
}

export interface AnimationHandle {
  stop(): SpringState;
}

/** Drive a spring on rAF. Returns a handle whose stop() reports current state
 * (value + velocity) so a new spring can take over seamlessly mid-flight. */
export function animateSpring(
  token: SpringToken,
  from: number,
  to: number,
  initialVelocity: number,
  onFrame: (state: SpringState) => void,
): AnimationHandle {
  const solver = createSpring(token, from, to, initialVelocity);
  let raf = 0;
  let last: SpringState = { value: from, velocity: initialVelocity, done: false };
  const start = performance.now();

  const tick = (now: number) => {
    last = solver.at((now - start) / 1000);
    onFrame(last);
    if (!last.done) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      cancelAnimationFrame(raf);
      return last;
    },
  };
}
