const API_URL = 'http://localhost:8081/api/auth';

export interface AuthData {
  token: string;
  role: string;
  email: string;
}

export const loginRequest = async (credentials: { email: string; password: string }): Promise<AuthData> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const registerRequest = async (userData: { email: string; password: string; role?: string }): Promise<AuthData> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Registration failed');
  }
  return response.json();
};
