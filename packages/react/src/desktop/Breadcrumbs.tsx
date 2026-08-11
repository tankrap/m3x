import * as React from 'react';
import { Icon } from '@tankmrap/m3x-primitives';

export interface BreadcrumbSpec {
  label: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbSpec[];
  /** separator glyph (default chevron_right) */
  separator?: string;
  className?: string;
}

/**
 * Breadcrumbs: path navigation; the last item is the current page.
 * Extras component.
 */
export function Breadcrumbs({ items, separator = 'chevron_right', className }: BreadcrumbsProps) {
  return (
    <nav className={['m3x-breadcrumbs', className].filter(Boolean).join(' ')} aria-label="Breadcrumb">
      <ol className="m3x-breadcrumbs__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const Tag = item.href ? 'a' : item.onClick ? 'button' : 'span';
          return (
            <li key={i} className="m3x-breadcrumbs__item">
              <Tag
                href={item.href}
                type={Tag === 'button' ? 'button' : undefined}
                className="m3x-breadcrumbs__link"
                aria-current={last ? 'page' : undefined}
                onClick={item.onClick}
              >
                {item.icon && <Icon size={16}>{item.icon}</Icon>}
                {item.label}
              </Tag>
              {!last && (
                <Icon size={16} className="m3x-breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </Icon>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
