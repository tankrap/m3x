import * as React from 'react';

/**
 * M3 state layer + ripple.
 *
 * Renders inside a `position: relative` host and attaches pointer listeners to
 * its parent element (same pattern as @material/web's <md-ripple>, Apache-2.0,
 * which this implementation follows: grow-from-press-point, soft edge, minimum
 * press duration before fade-out).
 *
 * Hover/press state-layer opacities come from --md-sys-state-* tokens; the
 * layer color is `currentColor` so hosts set `color` to the spec's state-layer
 * color role.
 */

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const OPACITY_OUT_MS = 375;
const EASE_STANDARD = 'cubic-bezier(0.2, 0, 0, 1)';

export interface RippleProps {
  disabled?: boolean;
}

export function Ripple({ disabled = false }: RippleProps) {
  const surfaceRef = React.useRef<HTMLSpanElement>(null);
  const pressRef = React.useRef<HTMLSpanElement>(null);
  const growAnimation = React.useRef<Animation | null>(null);
  const pressStartedAt = React.useRef(0);

  React.useEffect(() => {
    const surface = surfaceRef.current;
    const press = pressRef.current;
    const host = surface?.parentElement;
    if (!surface || !press || !host || disabled) return;

    const startPress = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pressStartedAt.current = performance.now();
      surface.dataset.pressed = 'true';

      const { width, height } = host.getBoundingClientRect();
      const maxDim = Math.max(width, height);
      const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);
      const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
      const hypotenuse = Math.sqrt(width * width + height * height);
      const maxRadius = hypotenuse + PADDING;
      const rippleScale = (maxRadius + softEdgeSize) / initialSize;

      const rect = host.getBoundingClientRect();
      const startX = event.clientX - rect.left - initialSize / 2;
      const startY = event.clientY - rect.top - initialSize / 2;
      const endX = (width - initialSize) / 2;
      const endY = (height - initialSize) / 2;

      press.style.width = `${initialSize}px`;
      press.style.height = `${initialSize}px`;
      press.style.opacity = 'var(--md-sys-state-press-state-layer-opacity, 0.1)';

      growAnimation.current?.cancel();
      growAnimation.current = press.animate(
        {
          transform: [
            `translate(${startX}px, ${startY}px) scale(1)`,
            `translate(${endX}px, ${endY}px) scale(${rippleScale})`,
          ],
        },
        { duration: PRESS_GROW_MS, easing: EASE_STANDARD, fill: 'forwards' },
      );
    };

    const endPress = () => {
      delete surfaceRef.current?.dataset.pressed;
      const elapsed = performance.now() - pressStartedAt.current;
      const delay = Math.max(MINIMUM_PRESS_MS - elapsed, 0);
      window.setTimeout(() => {
        if (!pressRef.current) return;
        pressRef.current.animate(
          { opacity: [getComputedStyle(pressRef.current).opacity, '0'] },
          { duration: OPACITY_OUT_MS, easing: 'linear', fill: 'forwards' },
        );
      }, delay);
    };

    const onEnter = () => (surface.dataset.hovered = 'true');
    const onLeave = () => {
      delete surface.dataset.hovered;
      endPress();
    };

    host.addEventListener('pointerdown', startPress);
    host.addEventListener('pointerup', endPress);
    host.addEventListener('pointercancel', endPress);
    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointerdown', startPress);
      host.removeEventListener('pointerup', endPress);
      host.removeEventListener('pointercancel', endPress);
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [disabled]);

  if (disabled) return null;
  return (
    <span className="m3x-ripple" ref={surfaceRef} aria-hidden="true">
      <span className="m3x-ripple__press" ref={pressRef} />
    </span>
  );
}
