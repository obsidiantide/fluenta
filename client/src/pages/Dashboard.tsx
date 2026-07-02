import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses, getEnrollments } from '../api/courses';
import type { Course, Enrollment } from '../api/courses';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, e] = await Promise.all([getCourses(), getEnrollments()]);
        setCourses(c);
        setEnrollments(e);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isTeacher = user?.role === 'TEACHER';
  const greeting = isTeacher ? 'Welcome, Teacher! 👨‍🏫' : 'Welcome back! 🎒';

  return (
    <div className="page-container">
      {/* Hero banner */}
      <div className="dashboard-hero glass-panel">
        <div className="dashboard-hero-text">
          <h1 className="gradient-text">{greeting}</h1>
          <p className="text-muted">{user?.email}</p>
          <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
        </div>
        <div className="dashboard-hero-art">🌐</div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="glass-panel stat-card">
          <div className="stat-icon">📚</div>
          <div>
            <div className="stat-number">{courses.length}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-number">{enrollments.length}</div>
            <div className="stat-label">{isTeacher ? 'Active Students' : 'Enrolled'}</div>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon">🏆</div>
          <div>
            <div className="stat-number">0</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="section-header">
        <h2>Available Courses</h2>
        <Link to="/courses" className="btn-primary">View All</Link>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No courses available yet.</p>
          {isTeacher && <Link to="/courses" className="btn-primary">Create a Course</Link>}
        </div>
      ) : (
        <div className="course-grid">
          {courses.slice(0, 3).map(course => (
            <Link to={`/courses/${course.id}`} key={course.id} className="glass-panel course-card">
              <div className="course-card-header">
                <span className={`level-badge level-${course.level?.toLowerCase()}`}>
                  {course.level || 'All Levels'}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p className="text-muted">{course.description?.slice(0, 80)}...</p>
              <div className="course-card-footer">
                <span className="course-meta">👤 {course.teacher?.user?.email || 'Instructor'}</span>
                <span className="arrow-link">View →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
