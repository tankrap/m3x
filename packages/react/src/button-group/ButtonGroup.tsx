import * as React from 'react';
import { useSprings } from '@ibx34/m3x-primitives';
import type { ButtonSize } from '../button/sizes';
import type { GroupPosition } from '../button/usePressMorph';

/** width expansion of the pressed member (Compose ButtonGroupDefaults) */
const EXPANDED_RATIO = 0.15;

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** connected: 2dp gap + shared capsule silhouette (children get groupPosition) */
  connected?: boolean;
  /** member size, used for gap spacing (standard variant) */
  size?: ButtonSize;
  children: React.ReactNode;
  'aria-label'?: string;
}

/** standard-group inner padding (audited 2026-08-09: larger gaps for small
 * buttons keep 48dp accessible targets) */
const STANDARD_GAP: Record<ButtonSize, number> = { xs: 18, s: 12, m: 8, l: 8, xl: 8 };

/**
 * M3 Expressive button group with the press "bump": the pressed member widens
 * by 15% and its neighbors compress by the same total, so the row keeps its
 * width. Spec: specs/button-group.md
 */
export function ButtonGroup({
  connected = false,
  size = 's',
  children,
  className,
  style,
  ...rest
}: ButtonGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const n = items.length;

  const wrapperRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [naturalWidths, setNaturalWidths] = React.useState<number[]>([]);
  const [pressedIndex, setPressedIndex] = React.useState(-1);

  // re-measure when fonts finish loading (label widths shift)
  const [measureTick, setMeasureTick] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      setNaturalWidths([]); // unstyle wrappers so the next measure is natural
      setMeasureTick((t) => t + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // measure natural widths once mounted (and when member count changes)
  React.useLayoutEffect(() => {
    setNaturalWidths(
      wrapperRefs.current.slice(0, n).map((el) => el?.getBoundingClientRect().width ?? 0),
    );
    setPressedIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, connected, size, measureTick]);

  const measured = naturalWidths.length === n && naturalWidths.every((w) => w > 0);

  // audited 2026-08-09: only STANDARD groups bump neighbors — "Connected
  // button groups don't add any interaction between buttons"
  const targets = React.useMemo(() => {
    if (!measured) return [];
    if (pressedIndex < 0 || connected) return naturalWidths;
    const expansion = naturalWidths[pressedIndex]! * EXPANDED_RATIO;
    const neighbors = [pressedIndex - 1, pressedIndex + 1].filter((i) => i >= 0 && i < n);
    return naturalWidths.map((w, i) => {
      if (i === pressedIndex) return w + expansion;
      if (neighbors.includes(i)) return w - expansion / neighbors.length;
      return w;
    });
  }, [measured, naturalWidths, pressedIndex, n, connected]);

  const widths = useSprings(targets, 'spatial', 'fast');

  const release = () => setPressedIndex(-1);

  return (
    <div
      role="group"
      className={[
        'm3x-button-group',
        connected ? 'm3x-button-group--connected' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gap: connected ? 2 : STANDARD_GAP[size], ...style }}
      {...rest}
    >
      {items.map((child, i) => {
        const position: GroupPosition = i === 0 ? 'first' : i === n - 1 ? 'last' : 'middle';
        const member = connected
          ? React.cloneElement(child as React.ReactElement<{ groupPosition?: GroupPosition }>, {
              groupPosition: position,
            })
          : child;
        return (
          <div
            key={(child as React.ReactElement).key ?? i}
            className="m3x-button-group__member"
            ref={(el) => {
              wrapperRefs.current[i] = el;
            }}
            style={
              measured && widths[i] != null
                ? { width: `${widths[i]}px` }
                : undefined
            }
            onPointerDown={() => setPressedIndex(i)}
            onPointerUp={release}
            onPointerLeave={release}
            onPointerCancel={release}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') setPressedIndex(i);
            }}
            onKeyUp={release}
          >
            {member}
          </div>
        );
      })}
    </div>
  );
}
