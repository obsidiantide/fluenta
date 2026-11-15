import { describe, expect, it } from 'vitest';
import type { Course } from '../api/courses';
import { filterCourses } from './courseFilter';

const course = (id: number, title: string, description: string, level: string): Course => ({
  id,
  title,
  description,
  level,
});

const courses = [
  course(1, 'English for Beginners', 'Basics of grammar', 'BEGINNER'),
  course(2, 'Business English', 'Emails and meetings', 'INTERMEDIATE'),
  course(3, 'IELTS Prep', 'Advanced writing practice', 'ADVANCED'),
];

describe('filterCourses', () => {
  it('returns everything for an empty query and ALL level', () => {
    expect(filterCourses(courses, '')).toHaveLength(3);
    expect(filterCourses(courses, '   ', 'ALL')).toHaveLength(3);
  });

  it('matches title and description case-insensitively', () => {
    expect(filterCourses(courses, 'business').map((c) => c.id)).toEqual([2]);
    expect(filterCourses(courses, 'GRAMMAR').map((c) => c.id)).toEqual([1]);
  });

  it('filters by level regardless of case', () => {
    expect(filterCourses(courses, '', 'advanced').map((c) => c.id)).toEqual([3]);
  });

  it('combines query and level', () => {
    expect(filterCourses(courses, 'english', 'BEGINNER').map((c) => c.id)).toEqual([1]);
    expect(filterCourses(courses, 'english', 'ADVANCED')).toEqual([]);
  });

  it('tolerates missing description and level', () => {
    const odd = [{ id: 9, title: 'Mystery' } as Course];
    expect(filterCourses(odd, 'mystery')).toHaveLength(1);
    expect(filterCourses(odd, '', 'BEGINNER')).toHaveLength(0);
  });
});
