import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel navbar">
      <div className="nav-brand">
        <Link to="/" className="gradient-text">Fluenta</Link>
      </div>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '✕' : '☰'}
      </button>
      <div id="nav-links" className={`nav-links${open ? ' open' : ''}`} onClick={close}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/profile" className="nav-link">{user?.email}</Link>
            <button onClick={handleLogout} className="btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
