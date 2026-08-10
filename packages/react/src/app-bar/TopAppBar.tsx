import * as React from 'react';
import { IconButton } from '../icon-button/IconButton';

export type TopAppBarSize = 'small' | 'medium' | 'large';

export interface TopAppBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  size?: TopAppBarSize;
  title: React.ReactNode;
  /** nav icon name (e.g. "menu" / "arrow_back") */
  navigationIcon?: string;
  onNavigationClick?: () => void;
  navigationLabel?: string;
  /** trailing action area (usually IconButtons) */
  actions?: React.ReactNode;
  /** on-scroll state: container switches to surface-container */
  elevated?: boolean;
}

/**
 * M3 top app bar — small / medium / large tiers with Expressive emphasized
 * titles on medium/large. Spec: specs/app-bars-navigation.md
 */
export function TopAppBar({
  size = 'small',
  title,
  navigationIcon,
  onNavigationClick,
  navigationLabel = 'Navigation',
  actions,
  elevated = false,
  className,
  ...rest
}: TopAppBarProps) {
  return (
    <header
      className={['m3x-top-app-bar', `m3x-top-app-bar--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      data-elevated={elevated || undefined}
      {...rest}
    >
      <div className="m3x-top-app-bar__row">
        {navigationIcon && (
          <IconButton
            icon={navigationIcon}
            aria-label={navigationLabel}
            onClick={onNavigationClick}
          />
        )}
        {size === 'small' && <div className="m3x-top-app-bar__title">{title}</div>}
        <div className="m3x-top-app-bar__spacer" />
        {actions && <div className="m3x-top-app-bar__actions">{actions}</div>}
      </div>
      {size !== 'small' && <div className="m3x-top-app-bar__title">{title}</div>}
    </header>
  );
}
