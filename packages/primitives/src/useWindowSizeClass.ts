import * as React from 'react';

/**
 * M3 window size classes (adaptive layout).
 * Spec: https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 * Breakpoints: compact <600, medium <840, expanded <1200, large <1600, extra-large ≥1600.
 */
export type WindowSizeClass = 'compact' | 'medium' | 'expanded' | 'large' | 'extraLarge';

export function widthToSizeClass(width: number): WindowSizeClass {
  if (width < 600) return 'compact';
  if (width < 840) return 'medium';
  if (width < 1200) return 'expanded';
  if (width < 1600) return 'large';
  return 'extraLarge';
}

/** Reactive window size class; 'expanded' during SSR. */
export function useWindowSizeClass(): WindowSizeClass {
  const subscribe = React.useCallback((cb: () => void) => {
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);
  return React.useSyncExternalStore(
    subscribe,
    () => widthToSizeClass(window.innerWidth),
    () => 'expanded',
  );
}
