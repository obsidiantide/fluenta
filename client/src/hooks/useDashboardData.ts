import { useCallback, useEffect, useState } from 'react';
import { getCourses, getEnrollments } from '../api/courses';
import type { Course, Enrollment } from '../api/courses';

interface UseDashboardDataResult {
  courses: Course[];
  enrollments: Enrollment[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/** Loads courses and enrollments for the dashboard; failures are surfaced, not swallowed. */
export function useDashboardData(): UseDashboardDataResult {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [c, e] = await Promise.all([getCourses(), getEnrollments()]);
      setCourses(c);
      setEnrollments(e);
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  return { courses, enrollments, loading, error, reload };
}
