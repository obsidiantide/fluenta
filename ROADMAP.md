# Roadmap

## Core Features
- [x] Filter lessons by course on the client (`getLessonsByCourse` filters by `lesson.course.id`)
- [ ] Add server-side `GET /api/lessons?courseId=` to stop sending every lesson
- [ ] Course search and level filter on the Courses page
- [ ] Enrollment progress update from the lesson view
- [ ] Message history for classroom chat rooms

## Test Coverage
- [x] Vitest setup and tests for `api/auth` and `api/courses`
- [ ] Tests for `AuthContext` (login/logout, localStorage restore)
- [ ] Tests for `ProtectedRoute`
- [ ] Controller tests for `LessonController` and `EnrollmentController`

## Architecture & Refactoring
- [ ] Extract a shared `apiFetch` helper (base URL, auth header, error handling) from `api/*.ts`
- [x] Move API base URLs to `import.meta.env` instead of hardcoded `localhost:8081`
- [ ] Extract a `useCourses` hook from `Courses.tsx`

## Performance & Polish
- [x] Lazy-load route pages with `React.lazy`
- [ ] Responsive layout for Navbar on small screens
- [ ] Loading and error states on Dashboard and Courses
