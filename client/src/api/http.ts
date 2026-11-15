import { API_BASE_URL } from './config';

export const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  /** Message thrown when the request fails. */
  errorMessage: string;
  /** Prefer the server's response text over `errorMessage` when available. */
  useServerError?: boolean;
}

/**
 * Authenticated JSON request against the API base URL.
 * Throws an Error with a meaningful message on a non-2xx response.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions): Promise<T> {
  const { method, body, errorMessage, useServerError = false } = options;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const serverText = useServerError ? await res.text() : '';
    throw new Error(serverText || errorMessage);
  }
  return res.json() as Promise<T>;
}
