// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const renderAt = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>secret content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('ProtectedRoute', () => {
  it('redirects anonymous users to /login', () => {
    renderAt();
    expect(screen.getByText('login page')).toBeTruthy();
    expect(screen.queryByText('secret content')).toBeNull();
  });

  it('renders children for an authenticated user', async () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('role', 'STUDENT');
    localStorage.setItem('email', 'a@b.c');
    renderAt();
    expect(await screen.findByText('secret content')).toBeTruthy();
  });
});
