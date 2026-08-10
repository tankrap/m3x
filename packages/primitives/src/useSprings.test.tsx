// @vitest-environment jsdom
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useSprings } from './useSprings';

function Probe({ target }: { target: number }) {
  const [v] = useSprings([target], 'spatial', 'fast');
  return <div data-testid="v">{v!.toFixed(2)}</div>;
}

describe('useSprings', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => {
        now += 16;
        cb(now);
      }, 16) as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const wrap = (ui: React.ReactElement) => (
    <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
  );

  it('starts at the initial target without animating', () => {
    render(wrap(<Probe target={100} />));
    expect(screen.getByTestId('v').textContent).toBe('100.00');
  });

  it('animates through intermediate values on retarget, then settles', async () => {
    const { rerender } = render(wrap(<Probe target={100} />));
    rerender(wrap(<Probe target={200} />));

    await act(async () => {
      vi.advanceTimersByTime(48); // ~3 frames
    });
    const mid = parseFloat(screen.getByTestId('v').textContent!);
    expect(mid).toBeGreaterThan(100.5);
    expect(mid).toBeLessThan(199);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(parseFloat(screen.getByTestId('v').textContent!)).toBeCloseTo(200, 0);
  });

  it('retargeting mid-flight springs back smoothly', async () => {
    const { rerender } = render(wrap(<Probe target={100} />));
    rerender(wrap(<Probe target={200} />));
    await act(async () => {
      vi.advanceTimersByTime(48);
    });
    rerender(wrap(<Probe target={100} />));
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(parseFloat(screen.getByTestId('v').textContent!)).toBeCloseTo(100, 0);
  });
});
