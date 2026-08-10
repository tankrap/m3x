import * as React from 'react';

export interface CarouselItemSpec {
  key: string;
  /** background image url or any node */
  image?: string;
  node?: React.ReactNode;
  label?: React.ReactNode;
  onClick?: () => void;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CarouselItemSpec[];
  /** width of a fully expanded (large) item */
  itemWidth?: number;
  /** width items compress to at the trailing edge (multi-browse keyline) */
  smallWidth?: number;
  gap?: number;
  height?: number;
  'aria-label'?: string;
}

/**
 * M3 multi-browse carousel with scroll-linked keyline compression: items enter
 * from the trailing edge at `smallWidth` and expand to `itemWidth` as they
 * scroll in (the Expressive carousel signature), with snap-to-keyline on
 * scroll end. Spec: specs/search-segmented-drawer-carousel.md
 */
export function Carousel({
  items,
  itemWidth = 240,
  smallWidth = 56,
  gap = 8,
  height = 200,
  className,
  ...rest
}: CarouselProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
  const snapTimer = React.useRef(0);
  const n = items.length;
  const step = itemWidth + gap;

  const layout = React.useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const C = scroller.clientWidth;
    const x = scroller.scrollLeft;
    for (let i = 0; i < n; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const natural = i * step - x;
      const available = C - natural;
      // fully off the trailing edge → keep at small width, invisible
      const w = Math.max(smallWidth, Math.min(itemWidth, available));
      const visible = available > 4 && natural < C;
      el.style.transform = `translateX(${(x + natural).toFixed(1)}px)`;
      el.style.width = `${w.toFixed(1)}px`;
      el.style.opacity = visible ? '1' : '0';
      // compressed items crop their content and fade their label (Compose behavior)
      if (w < itemWidth * 0.6) el.dataset.compressed = 'true';
      else delete el.dataset.compressed;
    }
  }, [n, step, itemWidth, smallWidth]);

  React.useLayoutEffect(() => {
    layout();
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const ro = new ResizeObserver(layout);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [layout]);

  const onScroll = () => {
    layout();
    // snap to the nearest keyline once scrolling settles
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const target = Math.round(scroller.scrollLeft / step) * step;
      if (Math.abs(target - scroller.scrollLeft) > 1) {
        scroller.scrollTo({ left: target, behavior: 'smooth' });
      }
    }, 140);
  };

  React.useEffect(() => () => window.clearTimeout(snapTimer.current), []);

  // spacer gives the scroll range; trailing pad lets the last item expand fully
  const spacerWidth = n > 0 ? (n - 1) * step + itemWidth : 0;

  return (
    <div
      ref={scrollerRef}
      className={['m3x-carousel', className].filter(Boolean).join(' ')}
      role="list"
      style={{ height }}
      onScroll={onScroll}
      {...rest}
    >
      <div className="m3x-carousel__spacer" style={{ width: spacerWidth, height: 1 }} />
      {items.map((item, i) => {
        const Tag = item.onClick ? 'button' : 'div';
        return (
          <Tag
            key={item.key}
            ref={(el: HTMLElement | null) => {
              itemRefs.current[i] = el;
            }}
            role="listitem"
            type={item.onClick ? 'button' : undefined}
            className={[
              'm3x-carousel__item',
              item.onClick ? 'm3x-carousel__item--interactive m3x-focus-host' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ width: itemWidth, height }}
            onClick={item.onClick}
          >
            {item.image ? (
              <img
                className="m3x-carousel__image"
                src={item.image}
                alt=""
                draggable={false}
                style={{ width: itemWidth }}
              />
            ) : (
              <div className="m3x-carousel__fill" style={{ width: itemWidth, height: '100%' }}>
                {item.node}
              </div>
            )}
            {item.label && <span className="m3x-carousel__label">{item.label}</span>}
          </Tag>
        );
      })}
    </div>
  );
}
