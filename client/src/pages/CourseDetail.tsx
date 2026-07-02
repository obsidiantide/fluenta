import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, getLessonsByCourse } from '../api/courses';
import type { Course, Lesson } from '../api/courses';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([getCourseById(Number(id)), getLessonsByCourse(Number(id))])
      .then(([c, l]) => {
        setCourse(c);
        setLessons(l);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-container loading-spinner">Loading...</div>;
  if (!course) return <div className="page-container">Course not found.</div>;

  const roomId = `course-${id}`;

  return (
    <div className="page-container">
      {/* Back */}
      <Link to="/courses" className="back-link">← Back to Courses</Link>

      {/* Course Header */}
      <div className="glass-panel course-detail-hero">
        <div>
          <span className="level-badge level-beginner">{course.level || 'All Levels'}</span>
          <h1>{course.title}</h1>
          <p className="text-muted">{course.description}</p>
          <div className="course-meta-row">
            <span>👤 Instructor</span>
            <span>📚 {lessons.length} Lessons</span>
          </div>
        </div>
        <div className="course-detail-actions">
          <Link to={`/classroom/${roomId}`} className="btn-primary">
            🎙️ Join Live Session
          </Link>
        </div>
      </div>

      {/* Lessons */}
      <div className="section-header">
        <h2>Lessons</h2>
        <span className="text-muted">{lessons.length} total</span>
      </div>

      {lessons.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No lessons added yet for this course.</p>
        </div>
      ) : (
        <div className="lessons-list">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className={`glass-panel lesson-item ${expanded === lesson.id ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === lesson.id ? null : lesson.id)}
            >
              <div className="lesson-header">
                <div className="lesson-number">{String(idx + 1).padStart(2, '0')}</div>
                <div className="lesson-title-col">
                  <h4>{lesson.title}</h4>
                </div>
                <span className="lesson-toggle">{expanded === lesson.id ? '▲' : '▼'}</span>
              </div>
              {expanded === lesson.id && (
                <div className="lesson-body">
                  <p>{lesson.content || 'No content available.'}</p>
                  {lesson.materialsUrl && (
                    <a href={lesson.materialsUrl} target="_blank" rel="noreferrer" className="btn-outline-sm">
                      📎 View Materials
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
