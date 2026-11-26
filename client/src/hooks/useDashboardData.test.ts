// @vitest-environment jsdom
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useDashboardData } from './useDashboardData';
import * as api from '../api/courses';

vi.mock('../api/courses');

const course = { id: 1, title: 'A1', description: '', level: 'BEGINNER' } as api.Course;
const enrollment = { id: 7 } as api.Enrollment;

describe('useDashboardData', () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(cleanup);

  it('loads courses and enrollments together', async () => {
    vi.mocked(api.getCourses).mockResolvedValue([course]);
    vi.mocked(api.getEnrollments).mockResolvedValue([enrollment]);
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.courses).toEqual([course]);
    expect(result.current.enrollments).toEqual([enrollment]);
    expect(result.current.error).toBe('');
  });

  it('reports an error when either request fails', async () => {
    vi.mocked(api.getCourses).mockResolvedValue([course]);
    vi.mocked(api.getEnrollments).mockRejectedValue(new Error('Failed to fetch enrollments'));
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch enrollments');
    expect(result.current.courses).toEqual([]);
  });

  it('reload recovers after a failure and clears the error', async () => {
    vi.mocked(api.getCourses).mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce([course]);
    vi.mocked(api.getEnrollments).mockResolvedValue([]);
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.error).toBe('boom'));
    await act(async () => { await result.current.reload(); });
    expect(result.current.error).toBe('');
    expect(result.current.courses).toEqual([course]);
  });
});
