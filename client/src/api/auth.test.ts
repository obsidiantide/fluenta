import { afterEach, describe, expect, it, vi } from 'vitest';
import { loginRequest, registerRequest } from './auth';

const mockFetch = (response: Partial<Response>) => {
  const fn = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fn);
  return fn;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loginRequest', () => {
  it('posts credentials as JSON and returns auth data', async () => {
    const data = { token: 't', role: 'STUDENT', email: 'a@b.c' };
    const fetchMock = mockFetch({ ok: true, json: async () => data });

    const result = await loginRequest({ email: 'a@b.c', password: 'secret' });

    expect(result).toEqual(data);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/auth\/login$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.c', password: 'secret' });
  });

  it('throws when the server rejects the credentials', async () => {
    mockFetch({ ok: false });
    await expect(loginRequest({ email: 'a@b.c', password: 'x' })).rejects.toThrow('Login failed');
  });
});

describe('registerRequest', () => {
  it('surfaces the server error text', async () => {
    mockFetch({ ok: false, text: async () => 'Email already used' });
    await expect(registerRequest({ email: 'a@b.c', password: 'x' })).rejects.toThrow('Email already used');
  });

  it('falls back to a default message when the body is empty', async () => {
    mockFetch({ ok: false, text: async () => '' });
    await expect(registerRequest({ email: 'a@b.c', password: 'x' })).rejects.toThrow('Registration failed');
  });
});
