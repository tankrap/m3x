import * as React from 'react';
import { Ripple } from '@tankmrap/m3x-primitives';

export interface NavBarLinkSpec {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface NavBarProps {
  /** brand slot (logo + product name) */
  brand?: React.ReactNode;
  links?: NavBarLinkSpec[];
  value?: string;
  onChange?: (id: string) => void;
  /** trailing slot (search, actions, avatar) */
  actions?: React.ReactNode;
  /** container color swaps to surface-container when true (e.g. on scroll) */
  elevated?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Desktop top navigation bar: brand, horizontal links with an active
 * indicator, trailing actions. Extras component.
 */
export function NavBar({
  brand,
  links = [],
  value,
  onChange,
  actions,
  elevated = false,
  className,
  ...aria
}: NavBarProps) {
  const [internal, setInternal] = React.useState(links[0]?.id ?? '');
  const active = value ?? internal;

  return (
    <header
      className={['m3x-navbar', className].filter(Boolean).join(' ')}
      data-elevated={elevated || undefined}
    >
      {brand && <div className="m3x-navbar__brand">{brand}</div>}
      {links.length > 0 && (
        <nav className="m3x-navbar__links" aria-label={aria['aria-label'] ?? 'Primary'}>
          {links.map((link) => {
            const isActive = link.id === active;
            const Tag = link.href ? 'a' : 'button';
            return (
              <Tag
                key={link.id}
                href={link.href}
                type={link.href ? undefined : 'button'}
                className="m3x-navbar__link m3x-focus-host"
                data-active={isActive || undefined}
                aria-current={isActive ? 'page' : undefined}
                {...(link.disabled ? { disabled: true, 'aria-disabled': true } : {})}
                onClick={() => {
                  if (link.disabled) return;
                  if (value === undefined) setInternal(link.id);
                  onChange?.(link.id);
                }}
              >
                <Ripple disabled={link.disabled} />
                {link.label}
              </Tag>
            );
          })}
        </nav>
      )}
      <div className="m3x-navbar__spacer" />
      {actions && <div className="m3x-navbar__actions">{actions}</div>}
    </header>
  );
}
