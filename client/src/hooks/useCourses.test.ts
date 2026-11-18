// @vitest-environment jsdom
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useCourses } from './useCourses';
import * as api from '../api/courses';

vi.mock('../api/courses');

const course = { id: 1, title: 'A1', description: '', level: 'BEGINNER' };

describe('useCourses', () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(cleanup);

  it('loads courses and clears loading', async () => {
    vi.mocked(api.getCourses).mockResolvedValue([course]);
    const { result } = renderHook(() => useCourses());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.courses).toEqual([course]);
    expect(result.current.error).toBe('');
  });

  it('exposes the error message when loading fails', async () => {
    vi.mocked(api.getCourses).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useCourses());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('boom');
    expect(result.current.courses).toEqual([]);
  });

  it('refetch picks up new data', async () => {
    vi.mocked(api.getCourses).mockResolvedValueOnce([]).mockResolvedValueOnce([course]);
    const { result } = renderHook(() => useCourses());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.refetch(); });
    expect(result.current.courses).toEqual([course]);
  });
});
