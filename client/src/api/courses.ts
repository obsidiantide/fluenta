import { API_BASE_URL as BASE_URL } from './config';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

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
}

export interface Enrollment {
  id: number;
  course: Course;
  enrolledAt: string;
  progress: number;
}

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${BASE_URL}/courses`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
};

export const getCourseById = async (id: number): Promise<Course> => {
  const res = await fetch(`${BASE_URL}/courses/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch course');
  return res.json();
};

export const getLessonsByCourse = async (_courseId: number): Promise<Lesson[]> => {
  const res = await fetch(`${BASE_URL}/lessons`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch lessons');
  const all: Lesson[] = await res.json();
  return all;
};

export const getEnrollments = async (): Promise<Enrollment[]> => {
  const res = await fetch(`${BASE_URL}/enrollments`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch enrollments');
  return res.json();
};

export const createCourse = async (data: { title: string; description: string; level: string }): Promise<Course> => {
  const res = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create course');
  }
  return res.json();
};
