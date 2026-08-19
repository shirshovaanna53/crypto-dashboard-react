import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePriceFlash } from './usePriceFlash';

describe('usePriceFlash', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when price has not changed', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceFlash(price), {
      initialProps: { price: 100 },
    });

    rerender({ price: 100 });

    expect(result.current).toBe(null);
  });

  it('returns "up" when price increases', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceFlash(price), {
      initialProps: { price: 100 },
    });

    rerender({ price: 105 });

    expect(result.current).toBe('up');
  });

  it('returns "down" when price decreases', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceFlash(price), {
      initialProps: { price: 100 },
    });

    rerender({ price: 95 });

    expect(result.current).toBe('down');
  });

  it('resets flash to null after the timeout', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ price }) => usePriceFlash(price), {
      initialProps: { price: 100 },
    });

    rerender({ price: 105 });
    expect(result.current).toBe('up');

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current).toBe(null);
  });

  it('does nothing when price is undefined', () => {
    const { result } = renderHook(({ price }) => usePriceFlash(price), {
      initialProps: { price: undefined as number | undefined },
    });

    expect(result.current).toBe(null);
  });
});
