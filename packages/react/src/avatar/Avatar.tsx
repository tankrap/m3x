import * as React from 'react';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** full name — initials are derived, and the fallback color is hashed from it */
  name: string;
  /** image url; falls back to initials on load error */
  src?: string;
  /** diameter in px (default 40) */
  size?: number;
  /** override the auto-assigned color pair */
  color?: { background: string; foreground: string };
}

const HUES = [0, 35, 70, 110, 150, 190, 230, 270, 310];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]![0] ?? '' : '';
  return (first + last).toUpperCase();
}

function hashHue(name: string): number {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) | 0;
  return HUES[Math.abs(h) % HUES.length]!;
}

/**
 * Avatar with image or auto-colored initials (stable per name). Extras
 * component — not part of the M3 component catalog.
 */
export function Avatar({ name, src, size = 40, color, className, style, ...rest }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const hue = hashHue(name);
  const bg = color?.background ?? `oklch(0.62 0.13 ${hue})`;
  const fg = color?.foreground ?? '#fff';
  const showImage = src && !errored;

  return (
    <span
      role="img"
      aria-label={name}
      className={['m3x-avatar', className].filter(Boolean).join(' ')}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: showImage ? 'var(--md-sys-color-surface-container)' : bg,
        color: fg,
        ...style,
      }}
      {...rest}
    >
      {showImage ? (
        <img
          className="m3x-avatar__image"
          src={src}
          alt=""
          onError={() => setErrored(true)}
        />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}
