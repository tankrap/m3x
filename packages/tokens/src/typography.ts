/**
 * M3 type scale + the Expressive "emphasized" variants of every role.
 * Default font: Roboto Flex (open, variable: wght/wdth/GRAD/opsz axes).
 *
 * Spec: https://m3.material.io/styles/typography/type-scale-tokens
 * Emphasized styles: Expressive update — same size/line-height, heavier weight
 * (and a positive grade on Roboto Flex for optical punch).
 */

export type TypeRole =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export interface TypeStyle {
  fontFamily: string;
  /** px (1dp = 1px on web) */
  fontSize: number;
  /** px */
  lineHeight: number;
  fontWeight: number;
  /** letter-spacing in px */
  letterSpacing: number;
}

export const FONT_FAMILY_PLAIN = `'Roboto Flex', Roboto, system-ui, sans-serif`;

const s = (
  fontSize: number,
  lineHeight: number,
  fontWeight: number,
  letterSpacing: number,
): TypeStyle => ({ fontFamily: FONT_FAMILY_PLAIN, fontSize, lineHeight, fontWeight, letterSpacing });

/** md.sys.typescale.* — baseline styles. */
export const typescale: Record<TypeRole, TypeStyle> = {
  displayLarge: s(57, 64, 400, -0.25),
  displayMedium: s(45, 52, 400, 0),
  displaySmall: s(36, 44, 400, 0),
  headlineLarge: s(32, 40, 400, 0),
  headlineMedium: s(28, 36, 400, 0),
  headlineSmall: s(24, 32, 400, 0),
  titleLarge: s(22, 28, 400, 0),
  titleMedium: s(16, 24, 500, 0.15),
  titleSmall: s(14, 20, 500, 0.1),
  bodyLarge: s(16, 24, 400, 0.5),
  bodyMedium: s(14, 20, 400, 0.25),
  bodySmall: s(12, 16, 400, 0.4),
  labelLarge: s(14, 20, 500, 0.1),
  labelMedium: s(12, 16, 500, 0.5),
  labelSmall: s(11, 16, 500, 0.5),
};

/** Expressive emphasized weight mapping: regular→medium, medium→semibold. */
const EMPHASIZED_WEIGHT: Record<number, number> = { 400: 500, 500: 600, 700: 700 };

/** md.sys.typescale.*-emphasized. */
export const typescaleEmphasized: Record<TypeRole, TypeStyle> = Object.fromEntries(
  (Object.keys(typescale) as TypeRole[]).map((role) => {
    const base = typescale[role];
    return [role, { ...base, fontWeight: EMPHASIZED_WEIGHT[base.fontWeight] ?? base.fontWeight }];
  }),
) as Record<TypeRole, TypeStyle>;

export interface TypeStyleOptions {
  emphasized?: boolean;
}

/** Get a type style: `getTypeStyle('headlineLarge', { emphasized: true })`. */
export function getTypeStyle(role: TypeRole, opts: TypeStyleOptions = {}): TypeStyle {
  return opts.emphasized ? typescaleEmphasized[role] : typescale[role];
}

/** kebab-case token name, e.g. headlineLarge → headline-large */
export function typeRoleToken(role: TypeRole): string {
  return role.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/** CSS shorthand-ish object for inline styles or CSS generation. */
export function typeStyleToCss(t: TypeStyle): Record<string, string> {
  return {
    'font-family': t.fontFamily,
    'font-size': `${t.fontSize}px`,
    'line-height': `${t.lineHeight}px`,
    'font-weight': String(t.fontWeight),
    'letter-spacing': `${t.letterSpacing}px`,
  };
}
