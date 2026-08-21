import { act, renderHook } from '@testing-library/react';
import {
  afterEach, beforeEach, describe, expect, it, vi
} from 'vitest';
import { useDebouncedValue } from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('emits the latest value once the delay passes without a change', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value), {
      initialProps: { value: 'l'},
    });

    rerender({ value: 'lon' });
    act(() => void vi.advanceTimersByTime(299));
    expect(result.current).toBe('l');

    rerender({ value: 'london' });
    act(() => void vi.advanceTimersByTime(299));
    expect(result.current).toBe('l');

    act(() => void vi.advanceTimersByTime(1));
    expect(result.current).toBe('london');
  });
});
