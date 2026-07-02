import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await registerRequest({ email, password, role });
      login(data.token, data.role, data.email);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="auth-logo">🎓</div>
        <h2 className="gradient-text">Create Account</h2>
        <p className="text-muted">Start your English learning journey today.</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>I am a...</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${role === 'STUDENT' ? 'active' : ''}`}
                onClick={() => setRole('STUDENT')}
              >
                🎒 Student
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'TEACHER' ? 'active' : ''}`}
                onClick={() => setRole('TEACHER')}
              >
                👨‍🏫 Teacher
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              id="register-email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              id="register-password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button id="register-submit" type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
