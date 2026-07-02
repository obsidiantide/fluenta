import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Classroom from './pages/Classroom';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="hero-landing">
                  <div className="hero-content">
                    <div className="hero-badge">🌐 English Learning Platform</div>
                    <h1 className="gradient-text">Master English<br/>with Fluenta</h1>
                    <p className="hero-sub">Live classrooms, structured courses, and real-time practice sessions — all in one place.</p>
                    <div className="hero-actions">
                      <a href="/register" className="btn-primary btn-lg">Get Started Free</a>
                      <a href="/courses" className="btn-outline btn-lg">Browse Courses</a>
                    </div>
                  </div>
                  <div className="hero-bg-orb orb-1"></div>
                  <div className="hero-bg-orb orb-2"></div>
                </div>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/classroom/:roomId" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
