# Roadmap

## Core Features
- [x] Filter lessons by course on the client (`getLessonsByCourse` filters by `lesson.course.id`)
- [ ] Add server-side `GET /api/lessons?courseId=` to stop sending every lesson
- [x] Course search and level filter on the Courses page
- [ ] Enrollment progress update from the lesson view
- [ ] Message history for classroom chat rooms

## Test Coverage
- [x] Vitest setup and tests for `api/auth` and `api/courses`
- [x] Tests for `AuthContext` (login/logout, localStorage restore)
- [x] Tests for `ProtectedRoute`
- [ ] Controller tests for `LessonController` and `EnrollmentController`
- [x] Tests for the classroom STOMP client (`api/classroom.ts`)

## Architecture & Refactoring
- [x] Extract a shared `apiFetch` helper (`api/http.ts`); `courses.ts` migrated
- [ ] Migrate remaining authenticated calls to `apiFetch`
- [x] Move API base URLs to `import.meta.env` instead of hardcoded `localhost:8081`
- [x] Extract a `useCourses` hook from `Courses.tsx`

## Performance & Polish
- [x] Lazy-load route pages with `React.lazy`
- [ ] Responsive layout for Navbar on small screens
- [ ] Loading and error states on Dashboard and Courses
