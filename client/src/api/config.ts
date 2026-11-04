const HTTP_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8081';

export const API_BASE_URL = `${HTTP_BASE}/api`;
export const WS_URL = HTTP_BASE.replace(/^http/, 'ws') + '/ws';
