import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCourse, getCourses, getLessonsByCourse } from './courses';

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: (k: string) => (k === 'token' ? 'jwt-123' : null) });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('courses api', () => {
  it('sends the bearer token from localStorage', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);

    await getCourses();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/courses$/);
    expect(init.headers.Authorization).toBe('Bearer jwt-123');
  });

  it('throws on a failed list request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(getCourses()).rejects.toThrow('Failed to fetch courses');
  });

  it('createCourse posts the payload and reports server errors', async () => {
    const payload = { title: 'T', description: 'D', level: 'A1' };
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, text: async () => 'Forbidden' });
    vi.stubGlobal('fetch', fetchMock);

    await expect(createCourse(payload)).rejects.toThrow('Forbidden');
    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(payload);
  });

  it('getLessonsByCourse returns only the course lessons ordered by index', async () => {
    const lessons = [
      { id: 1, title: 'B', content: '', orderIndex: 2, course: { id: 7 } },
      { id: 2, title: 'X', content: '', orderIndex: 1, course: { id: 8 } },
      { id: 3, title: 'A', content: '', orderIndex: 1, course: { id: 7 } },
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => lessons }));

    const result = await getLessonsByCourse(7);

    expect(result.map((l) => l.id)).toEqual([3, 1]);
  });
});
