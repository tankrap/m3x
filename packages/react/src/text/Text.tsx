import * as React from 'react';

export type TypescaleRole =
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** M3 typescale role (default bodyLarge) */
  variant?: TypescaleRole;
  /** Expressive emphasized weight */
  emphasized?: boolean;
  /** rendered element; defaults per role (display/headline → hN, body → p, …) */
  as?: keyof React.JSX.IntrinsicElements;
  /** color shorthand: a color role custom-property suffix, e.g. "primary",
   * "on-surface-variant", "error" */
  color?: string;
  children: React.ReactNode;
}

const DEFAULT_TAG: Record<string, keyof React.JSX.IntrinsicElements> = {
  display: 'h1',
  headline: 'h2',
  title: 'h3',
  body: 'p',
  label: 'span',
};

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

/**
 * Typography element mapping the full M3 typescale (+ emphasized weights) to
 * semantic HTML. Extras component — not part of the M3 component catalog.
 */
export function Text({
  variant = 'bodyLarge',
  emphasized = false,
  as,
  color,
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const group = variant.replace(/[A-Z].*$/, '');
  const Tag = (as ?? DEFAULT_TAG[group] ?? 'span') as React.ElementType;
  const k = kebab(variant);
  const weightVar = emphasized
    ? `var(--md-sys-typescale-emphasized-${k}-weight, var(--md-sys-typescale-${k}-weight))`
    : `var(--md-sys-typescale-${k}-weight)`;

  return (
    <Tag
      className={['m3x-text', className].filter(Boolean).join(' ')}
      style={{
        margin: 0,
        fontFamily: `var(--md-sys-typescale-${k}-font)`,
        fontSize: `var(--md-sys-typescale-${k}-size)`,
        lineHeight: `var(--md-sys-typescale-${k}-line-height)`,
        letterSpacing: `var(--md-sys-typescale-${k}-tracking, normal)`,
        fontWeight: weightVar,
        color: color ? `var(--md-sys-color-${color}, var(--m3x-color-${color}))` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
