import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, createCourse } from '../api/courses';
import type { Course } from '../api/courses';
import { useAuth } from '../context/AuthContext';

const levelColors: Record<string, string> = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', level: 'BEGINNER' });
  const { user } = useAuth();

  const fetchCourses = () => {
    getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    setCreating(true);
    setFormError('');
    try {
      await createCourse(form);
      setShowModal(false);
      setForm({ title: '', description: '', level: 'BEGINNER' });
      fetchCourses(); // Refresh list
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create course.');
    } finally {
      setCreating(false);
    }
  };

  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Browse Courses</h1>
          <p className="text-muted">Find the perfect English course for your level</p>
        </div>
        {isTeacher && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Create Course
          </button>
        )}
      </div>

      <div className="search-bar glass-panel">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="input-field search-input"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No courses found. {isTeacher ? 'Create the first one!' : 'Check back soon.'}</p>
        </div>
      ) : (
        <div className="course-grid">
          {filtered.map(course => (
            <Link to={`/courses/${course.id}`} key={course.id} className="glass-panel course-card">
              <div className="course-card-header">
                <span
                  className="level-badge"
                  style={{
                    backgroundColor: (levelColors[course.level?.toLowerCase() || ''] || '#94a3b8') + '22',
                    color: levelColors[course.level?.toLowerCase() || ''] || '#94a3b8',
                    border: `1px solid ${levelColors[course.level?.toLowerCase() || ''] || '#94a3b8'}44`
                  }}
                >
                  {course.level || 'All Levels'}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p className="text-muted">{course.description?.slice(0, 100) || 'No description provided.'}</p>
              <div className="course-card-footer">
                <span className="course-meta">👤 Instructor</span>
                <span className="btn-outline-sm">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-panel modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Course</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {formError && <div className="error-message">{formError}</div>}

            <form onSubmit={handleCreate} className="auth-form">
              <div className="form-group">
                <label>Course Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. English for Beginners"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="input-field textarea-field"
                  placeholder="What will students learn in this course?"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Level</label>
                <div className="level-selector">
                  {LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      className={`role-btn ${form.level === lvl ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, level: lvl })}
                    >
                      {lvl === 'BEGINNER' ? '🌱' : lvl === 'INTERMEDIATE' ? '🌿' : '🌳'} {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : '✨ Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
