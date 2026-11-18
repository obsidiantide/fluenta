import { useCallback, useEffect, useState } from 'react';
import { getCourses } from '../api/courses';
import type { Course } from '../api/courses';

interface UseCoursesResult {
  courses: Course[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

/** Loads the course list and exposes loading/error state and a manual refetch. */
export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setCourses(await getCourses());
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
  }, [refetch]);

  return { courses, loading, error, refetch };
}
