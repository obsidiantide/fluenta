import type { Course } from '../api/courses';

export const ALL_LEVELS = 'ALL';

/**
 * Filters courses by a free-text query (title or description,
 * case-insensitive) and an optional level ("ALL" disables the level filter).
 */
export function filterCourses(courses: Course[], query: string, level: string = ALL_LEVELS): Course[] {
  const q = query.trim().toLowerCase();
  const wantedLevel = level.toUpperCase();
  return courses.filter((c) => {
    if (wantedLevel !== ALL_LEVELS && (c.level || '').toUpperCase() !== wantedLevel) return false;
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q);
  });
}
