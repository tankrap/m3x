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
  /** width of a fully visible (large) item */
  itemWidth?: number;
  height?: number;
  'aria-label'?: string;
}

/**
 * M3 multi-browse carousel (v1): scroll-snapping strip of 28dp-rounded items
 * with edge masking; label scrim at the bottom of image items.
 * Keyline-based dynamic item-width morphing is a tracked follow-up
 * (specs/search-segmented-drawer-carousel.md).
 */
export function Carousel({
  items,
  itemWidth = 240,
  height = 200,
  className,
  ...rest
}: CarouselProps) {
  return (
    <div
      className={['m3x-carousel', className].filter(Boolean).join(' ')}
      role="list"
      style={{ height }}
      {...rest}
    >
      {items.map((item) => {
        const Tag = item.onClick ? 'button' : 'div';
        return (
          <Tag
            key={item.key}
            role="listitem"
            type={item.onClick ? 'button' : undefined}
            className={[
              'm3x-carousel__item',
              item.onClick ? 'm3x-carousel__item--interactive m3x-focus-host' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ width: itemWidth }}
            onClick={item.onClick}
          >
            {item.image ? (
              <img className="m3x-carousel__image" src={item.image} alt="" draggable={false} />
            ) : (
              item.node
            )}
            {item.label && <span className="m3x-carousel__label">{item.label}</span>}
          </Tag>
        );
      })}
    </div>
  );
}
