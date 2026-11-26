// @vitest-environment jsdom
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

const logout = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, user: { email: 'a@b.c' }, logout }),
}));

const renderNav = () => render(<MemoryRouter><Navbar /></MemoryRouter>);

describe('Navbar', () => {
  afterEach(() => { cleanup(); logout.mockClear(); });

  it('starts collapsed and toggles via the menu button', () => {
    renderNav();
    const toggle = screen.getByLabelText('Toggle navigation');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('nav-links')!.className).toContain('open');
  });

  it('closes the menu after following a link', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Toggle navigation'));
    fireEvent.click(screen.getByText('Courses'));
    expect(screen.getByLabelText('Toggle navigation').getAttribute('aria-expanded')).toBe('false');
  });

  it('logs out from the menu', () => {
    renderNav();
    fireEvent.click(screen.getByText('Logout'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
