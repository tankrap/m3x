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
  TonalPalette,
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

// ---------------------------------------------------------------------------
// Extended semantic roles (beyond the M3 spec): success / warning / info.
// Built with the same tonal-palette machinery and standard M3 tone mapping so
// they sit naturally next to spec roles in both schemes.
// ---------------------------------------------------------------------------

export const EXTENDED_ROLE_GROUPS = ['success', 'warning', 'info'] as const;
export type ExtendedGroup = (typeof EXTENDED_ROLE_GROUPS)[number];

const EXTENDED_HUES: Record<ExtendedGroup, { hue: number; chroma: number }> = {
  success: { hue: 145, chroma: 45 },
  warning: { hue: 75, chroma: 50 },
  info: { hue: 245, chroma: 40 },
};

export type ExtendedScheme = Record<string, string>;

/** success/onSuccess/successContainer/onSuccessContainer (+ warning, info). */
export function createExtendedScheme(dark: boolean): ExtendedScheme {
  const out: ExtendedScheme = {};
  for (const group of EXTENDED_ROLE_GROUPS) {
    const { hue, chroma } = EXTENDED_HUES[group];
    const palette = TonalPalette.fromHueAndChroma(hue, chroma);
    const cap = group[0]!.toUpperCase() + group.slice(1);
    out[group] = hexFromArgb(palette.tone(dark ? 80 : 40));
    out[`on${cap}`] = hexFromArgb(palette.tone(dark ? 20 : 100));
    out[`${group}Container`] = hexFromArgb(palette.tone(dark ? 30 : 90));
    out[`on${cap}Container`] = hexFromArgb(palette.tone(dark ? 90 : 10));
  }
  return out;
}
