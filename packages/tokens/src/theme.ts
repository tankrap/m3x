/**
 * createTheme: seed color + options → typed theme object + CSS custom properties.
 * Everything downstream (primitives, components) renders exclusively from the
 * `--md-sys-*` variables emitted here.
 */
import { ColorScheme, ColorSchemeOptions, colorVar, createColorScheme, createExtendedScheme } from './color';
import {
  MotionSchemeName,
  MotionSchemeTokens,
  motionSchemes,
  easing,
  duration,
} from './motion';
import { cornerTokens } from './shape';
import { typescale, typescaleEmphasized, typeRoleToken, TypeRole, TypeStyle } from './typography';
import { elevationShadow } from './elevation';
import { stateLayerOpacity, disabledOpacity } from './state';

export interface ThemeOptions extends ColorSchemeOptions {
  motionScheme?: MotionSchemeName;
}

export interface Theme {
  options: Required<Pick<ThemeOptions, 'variant' | 'dark' | 'contrast' | 'motionScheme'>> & {
    seedColor: string;
  };
  colors: ColorScheme;
  motion: MotionSchemeTokens;
  /** flat map of css custom property → value */
  cssVars: Record<string, string>;
}

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

function typeVars(prefix: string, role: TypeRole, t: TypeStyle, vars: Record<string, string>) {
  const base = `--md-sys-typescale-${prefix}${typeRoleToken(role)}`;
  vars[`${base}-font`] = t.fontFamily;
  vars[`${base}-size`] = `${t.fontSize}px`;
  vars[`${base}-line-height`] = `${t.lineHeight}px`;
  vars[`${base}-weight`] = String(t.fontWeight);
  vars[`${base}-tracking`] = `${t.letterSpacing}px`;
}

export function createTheme(options: ThemeOptions): Theme {
  const {
    seedColor,
    variant = 'tonalSpot',
    dark = false,
    contrast = 'standard',
    motionScheme = 'expressive',
  } = options;

  const colors = createColorScheme({ seedColor, variant, dark, contrast });
  const motion = motionSchemes[motionScheme];
  const cssVars: Record<string, string> = {};

  for (const [role, value] of Object.entries(colors)) {
    cssVars[colorVar(role as keyof ColorScheme)] = value;
  }
  // extended semantic roles (success/warning/info — beyond the M3 spec)
  for (const [role, value] of Object.entries(createExtendedScheme(dark))) {
    cssVars[`--m3x-color-${role.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  }
  for (const [name, px] of Object.entries(cornerTokens)) {
    cssVars[`--md-sys-shape-corner-${kebab(name)}`] = `${px}px`;
  }
  for (const [level, shadow] of Object.entries(elevationShadow)) {
    cssVars[`--md-sys-elevation-level${level}`] = shadow;
  }
  for (const [state, opacity] of Object.entries(stateLayerOpacity)) {
    cssVars[`--md-sys-state-${kebab(state)}-state-layer-opacity`] = String(opacity);
  }
  cssVars['--md-sys-state-disabled-container-opacity'] = String(disabledOpacity.container);
  cssVars['--md-sys-state-disabled-content-opacity'] = String(disabledOpacity.content);
  for (const role of Object.keys(typescale) as TypeRole[]) {
    typeVars('', role, typescale[role], cssVars);
    typeVars('emphasized-', role, typescaleEmphasized[role], cssVars);
  }
  for (const [name, value] of Object.entries(easing)) {
    cssVars[`--md-sys-motion-easing-${kebab(name)}`] = value;
  }
  for (const [name, ms] of Object.entries(duration)) {
    cssVars[`--md-sys-motion-duration-${kebab(name)}`] = `${ms}ms`;
  }
  // spring tokens as raw numbers (consumed by the JS spring solver via theme
  // context; exposed as vars too for debugging/devtools)
  for (const family of ['spatial', 'effects'] as const) {
    for (const speed of ['default', 'fast', 'slow'] as const) {
      const s = motion[family][speed];
      cssVars[`--md-sys-motion-${family}-${speed}-damping`] = String(s.dampingRatio);
      cssVars[`--md-sys-motion-${family}-${speed}-stiffness`] = String(s.stiffness);
    }
  }

  return {
    options: { seedColor, variant, dark, contrast, motionScheme },
    colors,
    motion,
    cssVars,
  };
}

/** Serialize theme vars to a CSS rule body (for SSR <style> tags or stylesheets). */
export function themeToCssText(theme: Theme, selector = ':root'): string {
  const body = Object.entries(theme.cssVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}
