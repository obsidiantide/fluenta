import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './http';

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'tok' });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiFetch', () => {
  it('prefixes the API base URL and sends auth headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ a: 1 }) });
    vi.stubGlobal('fetch', fetchMock);

    const data = await apiFetch<{ a: number }>('/things', { errorMessage: 'fail' });

    expect(data).toEqual({ a: 1 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/things$/);
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect(init.body).toBeUndefined();
  });

  it('serializes the body as JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/things', { method: 'POST', body: { x: 1 }, errorMessage: 'fail' });

    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"x":1}');
  });

  it('throws the fallback message by default', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, text: async () => 'server says no' }));
    await expect(apiFetch('/x', { errorMessage: 'fallback' })).rejects.toThrow('fallback');
  });

  it('uses the server text when requested, falling back when it is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, text: async () => 'server says no' }));
    await expect(apiFetch('/x', { errorMessage: 'fallback', useServerError: true })).rejects.toThrow('server says no');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, text: async () => '' }));
    await expect(apiFetch('/x', { errorMessage: 'fallback', useServerError: true })).rejects.toThrow('fallback');
  });
});
