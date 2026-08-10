import '@testing-library/jest-dom/vitest';

// jsdom lacks matchMedia and rAF-driven animation plumbing
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

if (!(globalThis as { ResizeObserver?: unknown }).ResizeObserver) {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!Element.prototype.animate) {
  Element.prototype.animate = (() => ({
    cancel: () => {},
    finished: Promise.resolve(),
  })) as unknown as typeof Element.prototype.animate;
}
