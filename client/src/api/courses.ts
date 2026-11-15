import { apiFetch } from './http';

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  teacher?: { id: number; bio: string; user?: { email: string } };
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  orderIndex: number;
  materialsUrl?: string;
  course?: { id: number };
}

export interface Enrollment {
  id: number;
  course: Course;
  enrolledAt: string;
  progress: number;
}

export const getCourses = (): Promise<Course[]> =>
  apiFetch('/courses', { errorMessage: 'Failed to fetch courses' });

export const getCourseById = (id: number): Promise<Course> =>
  apiFetch(`/courses/${id}`, { errorMessage: 'Failed to fetch course' });

export const getLessonsByCourse = async (courseId: number): Promise<Lesson[]> => {
  const all = await apiFetch<Lesson[]>('/lessons', { errorMessage: 'Failed to fetch lessons' });
  return all
    .filter((lesson) => lesson.course?.id === courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
};

export const getEnrollments = (): Promise<Enrollment[]> =>
  apiFetch('/enrollments', { errorMessage: 'Failed to fetch enrollments' });

export const createCourse = (data: { title: string; description: string; level: string }): Promise<Course> =>
  apiFetch('/courses', {
    method: 'POST',
    body: data,
    errorMessage: 'Failed to create course',
    useServerError: true,
  });
