/**
 * Dynamic color pipeline: seed → HCT tonal palettes → scheme color roles.
 * Built entirely on Google's official @material/material-color-utilities
 * (Apache-2.0); we never reimplement HCT math.
 *
 * Spec: https://m3.material.io/styles/color/system/overview
 */
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  DynamicScheme,
  MaterialDynamicColors,
  SchemeTonalSpot,
  SchemeVibrant,
  SchemeExpressive,
  SchemeNeutral,
  SchemeMonochrome,
  SchemeFidelity,
  SchemeContent,
} from '@material/material-color-utilities';

/** M3 scheme variants. `tonalSpot` is the M3 default; `vibrant`/`expressive` are the
 * Expressive-era recommendations for bolder products. */
export type SchemeVariant =
  | 'tonalSpot'
  | 'vibrant'
  | 'expressive'
  | 'neutral'
  | 'monochrome'
  | 'fidelity'
  | 'content';

/** Contrast presets matching the system contrast settings. */
export type ContrastLevel = 'standard' | 'medium' | 'high';

const CONTRAST: Record<ContrastLevel, number> = {
  standard: 0,
  medium: 0.5,
  high: 1,
};

const SCHEME_CTORS: Record<
  SchemeVariant,
  new (hct: Hct, isDark: boolean, contrast: number) => DynamicScheme
> = {
  tonalSpot: SchemeTonalSpot,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
  neutral: SchemeNeutral,
  monochrome: SchemeMonochrome,
  fidelity: SchemeFidelity,
  content: SchemeContent,
};

/** Every M3 color role, in md.sys.color.* naming (camelCase). */
export const COLOR_ROLES = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'inverseSurface',
  'inverseOnSurface',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'surfaceTint',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];
export type ColorScheme = Record<ColorRole, string>;

export interface ColorSchemeOptions {
  seedColor: string;
  variant?: SchemeVariant;
  dark?: boolean;
  contrast?: ContrastLevel;
}

/** Build a full M3 color scheme (hex strings) from a seed color. */
export function createColorScheme({
  seedColor,
  variant = 'tonalSpot',
  dark = false,
  contrast = 'standard',
}: ColorSchemeOptions): ColorScheme {
  const Ctor = SCHEME_CTORS[variant];
  const scheme = new Ctor(Hct.fromInt(argbFromHex(seedColor)), dark, CONTRAST[contrast]);
  const out = {} as ColorScheme;
  for (const role of COLOR_ROLES) {
    const dynamicColor = MaterialDynamicColors[role];
    out[role] = hexFromArgb(dynamicColor.getArgb(scheme));
  }
  return out;
}

/** camelCase role → css custom property name, e.g. onPrimaryContainer → --md-sys-color-on-primary-container */
export function colorVar(role: ColorRole): string {
  return `--md-sys-color-${role.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}
