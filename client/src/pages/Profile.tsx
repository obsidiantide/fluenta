import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const joinedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="page-container">
      <h1>My Profile</h1>

      <div className="glass-panel profile-card">
        <div className="profile-avatar">
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.email}</h2>
          <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
        </div>
      </div>

      <div className="glass-panel profile-details">
        <div className="profile-detail-row">
          <span className="detail-label">📧 Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="profile-detail-row">
          <span className="detail-label">🎭 Role</span>
          <span>{user?.role}</span>
        </div>
        <div className="profile-detail-row">
          <span className="detail-label">📅 Member Since</span>
          <span>{joinedDate}</span>
        </div>
        <div className="profile-detail-row">
          <span className="detail-label">🔒 Auth</span>
          <span className="token-preview">JWT ••••{user?.token?.slice(-8)}</span>
        </div>
      </div>

      <button onClick={handleLogout} className="btn-danger">
        Logout from Fluenta
      </button>
    </div>
  );
};

export default Profile;
