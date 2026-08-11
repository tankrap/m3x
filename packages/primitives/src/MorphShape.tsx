import * as React from 'react';
import {
  alignedShapeMorph,
  outlinePoints,
  Point,
  pointsToSvgPath,
  shapeLibrary,
  shapeOutline,
  ShapeName,
} from '@tankmrap/m3x-tokens';
import { animateSpring, AnimationHandle } from './spring';
import { useTheme, MotionSpeed } from './ThemeProvider';

export interface MorphShapeProps extends React.SVGAttributes<SVGSVGElement> {
  /** current shape from the M3 shape library; changes spring-morph */
  shape: ShapeName;
  size?: number;
  speed?: MotionSpeed;
  /** fill color; defaults to currentColor */
  color?: string;
}

/**
 * SVG shape from the Expressive shape library that spring-morphs between
 * shapes. All library shapes share a normalized outline point count, so any
 * shape can morph into any other; retargeting mid-flight snapshots the current
 * blended outline and springs on from there (velocity preserved).
 */
export function MorphShape({
  shape,
  size = 48,
  speed = 'default',
  color = 'currentColor',
  ...rest
}: MorphShapeProps) {
  const { spring, reducedMotion } = useTheme();
  const pointsRef = React.useRef<Point[]>(shapeOutline(shape));
  const animRef = React.useRef<AnimationHandle | null>(null);
  const shownShape = React.useRef(shape);
  const [, forceRender] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    if (shape === shownShape.current) return;
    const prevShape = shownShape.current;
    shownShape.current = shape;

    const prev = animRef.current?.stop();
    if (reducedMotion) {
      pointsRef.current = shapeOutline(shape);
      forceRender();
      return;
    }

    // Settled → use the corner-aligned morph (corners travel to corners, as in
    // Compose's MaterialShapes). Mid-flight retarget → snapshot-lerp fallback.
    let from: Point[];
    let to: Point[];
    if (prev == null || prev.done) {
      const aligned = alignedShapeMorph(prevShape, shape);
      from = aligned.from;
      to = aligned.to;
    } else {
      from = pointsRef.current.map((p) => ({ ...p }));
      to = outlinePoints(shapeLibrary[shape], from.length);
    }

    animRef.current = animateSpring(spring('spatial', speed), 0, 1, prev?.velocity ?? 0, (s) => {
      // t may overshoot 1 (expressive springs) — lerp extrapolates, which is
      // exactly the springy "over-morph" the spec shows
      pointsRef.current = from.map((p, i) => ({
        x: p.x + (to[i]!.x - p.x) * s.value,
        y: p.y + (to[i]!.y - p.y) * s.value,
      }));
      forceRender();
    });
  }, [shape, speed, spring, reducedMotion]);

  React.useEffect(() => () => void animRef.current?.stop(), []);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      {...rest}
    >
      <path d={pointsToSvgPath(pointsRef.current, size)} fill={color} />
    </svg>
  );
}
