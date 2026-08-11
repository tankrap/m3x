import * as React from 'react';
import { Icon, Ripple } from '@tankmrap/m3x-primitives';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

/** M3 list container. Spec: specs/app-bars-navigation.md */
export function List({ children, className, ...rest }: ListProps) {
  return (
    <ul className={['m3x-list', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </ul>
  );
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  headline: React.ReactNode;
  supportingText?: React.ReactNode;
  /** second supporting line (3-line item) */
  secondLine?: React.ReactNode;
  leadingIcon?: string;
  /** e.g. an <img>/avatar node; overrides leadingIcon */
  leading?: React.ReactNode;
  trailingText?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

/** M3 list item: 1–3 lines, leading icon/avatar, trailing text/element. */
export function ListItem({
  headline,
  supportingText,
  secondLine,
  leadingIcon,
  leading,
  trailingText,
  trailing,
  onClick,
  className,
  ...rest
}: ListItemProps) {
  const interactive = onClick != null;
  const lines = secondLine ? 3 : supportingText ? 2 : 1;
  return (
    <li
      className={[
        'm3x-list-item',
        `m3x-list-item--${lines}-line`,
        interactive ? 'm3x-list-item--interactive m3x-focus-host' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      {...(interactive
        ? {
            tabIndex: 0,
            role: 'button',
            onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                (e.currentTarget as HTMLElement).click();
              }
            },
          }
        : {})}
      {...rest}
    >
      {interactive && <Ripple />}
      {leading ?? (leadingIcon && <Icon size={24} className="m3x-list-item__icon">{leadingIcon}</Icon>)}
      <span className="m3x-list-item__content">
        <span className="m3x-list-item__headline">{headline}</span>
        {supportingText && <span className="m3x-list-item__supporting">{supportingText}</span>}
        {secondLine && <span className="m3x-list-item__supporting">{secondLine}</span>}
      </span>
      {trailingText && <span className="m3x-list-item__trailing-text">{trailingText}</span>}
      {trailing}
    </li>
  );
}
