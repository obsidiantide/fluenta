// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('AuthProvider', () => {
  it('starts unauthenticated when storage is empty', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('restores the session from localStorage', () => {
    localStorage.setItem('token', 'tok');
    localStorage.setItem('role', 'TEACHER');
    localStorage.setItem('email', 't@x.io');
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ token: 'tok', role: 'TEACHER', email: 't@x.io' });
  });

  it('does not restore a partial session', () => {
    localStorage.setItem('token', 'tok');
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login stores credentials and authenticates', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login('tok', 'STUDENT', 's@x.io'));
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('tok');
    expect(localStorage.getItem('role')).toBe('STUDENT');
    expect(localStorage.getItem('email')).toBe('s@x.io');
  });

  it('logout clears storage and state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login('tok', 'STUDENT', 's@x.io'));
    act(() => result.current.logout());
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
  });

  it('useAuth throws outside the provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used inside AuthProvider');
  });
});
