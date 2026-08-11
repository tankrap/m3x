import * as React from 'react';
import {
  createTheme,
  Theme,
  ThemeOptions,
  SpringToken,
  MotionSchemeTokens,
  standardMotionScheme,
} from '@ibx34/m3x-tokens';

export type MotionFamily = keyof MotionSchemeTokens; // 'spatial' | 'effects'
export type MotionSpeed = 'default' | 'fast' | 'slow';

export interface ThemeContextValue {
  theme: Theme;
  reducedMotion: boolean;
  /** Resolve a spring token, honoring reduced motion: spatial springs fall back to
   * the standard (non-overshooting) scheme, and callers should treat
   * `reducedMotion` as "resolve spatial morphs instantly". */
  spring(family: MotionFamily, speed?: MotionSpeed): SpringToken;
}

const fallbackTheme = createTheme({ seedColor: '#6750A4' });

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: fallbackTheme,
  reducedMotion: false,
  spring: (family, speed = 'default') => fallbackTheme.motion[family][speed],
});

export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}

const canMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

function useReducedMotion(): boolean {
  const subscribe = React.useCallback((cb: () => void) => {
    if (!canMatchMedia()) return () => {};
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  }, []);
  return React.useSyncExternalStore(
    subscribe,
    () => (canMatchMedia() ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
    () => false, // SSR
  );
}

export interface ThemeProviderProps extends ThemeOptions {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Applies the theme's `--md-sys-*` custom properties on a wrapper element
 * (inline custom properties — SSR-safe, scoped, nestable) and provides motion
 * context to all primitives/components.
 */
export function ThemeProvider({
  children,
  className,
  style,
  ...options
}: ThemeProviderProps) {
  const theme = React.useMemo(
    () => createTheme(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.seedColor, options.variant, options.dark, options.contrast, options.motionScheme],
  );
  const reducedMotion = useReducedMotion();

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      reducedMotion,
      spring: (family, speed = 'default') =>
        reducedMotion && family === 'spatial'
          ? standardMotionScheme.spatial[speed]
          : theme.motion[family][speed],
    }),
    [theme, reducedMotion],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={['m3x-theme', className].filter(Boolean).join(' ')}
        style={{
          ...(theme.cssVars as React.CSSProperties),
          color: 'var(--md-sys-color-on-surface)',
          fontFamily: 'var(--md-sys-typescale-body-large-font)',
          ...style,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
