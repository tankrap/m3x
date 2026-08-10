import * as React from 'react';

/**
 * Material Symbols icon (variable font, Apache-2.0), with animatable axes.
 * Consumers self-host or link the font; see the playground for an example.
 * The FILL axis transition powers the M3 toggle "fill-in" animation.
 */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** icon name, e.g. "favorite" */
  children: string;
  /** 0–1 */
  fill?: number;
  /** 100–700 */
  weight?: number;
  /** -25–200 */
  grade?: number;
  /** 20–48; defaults to `size` */
  opticalSize?: number;
  /** rendered size in px */
  size?: number;
  variant?: 'outlined' | 'rounded' | 'sharp';
}

export function Icon({
  children,
  fill = 0,
  weight = 400,
  grade = 0,
  opticalSize,
  size = 24,
  variant = 'outlined',
  className,
  style,
  ...rest
}: IconProps) {
  return (
    <span
      className={[`m3x-icon`, `material-symbols-${variant}`, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize ?? size}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
