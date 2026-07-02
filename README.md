# Fluenta

An English learning platform focused on interactive courses and live real-time classrooms.

## Tech Stack
* **Backend:** Spring Boot 3, Spring Security (JWT), Spring Data JPA, WebSockets (STOMP), MySQL.
* **Frontend:** React 18, Vite, TypeScript, React Router, STOMP.js.

## Features
* **Role-based Auth:** Student and Teacher roles with JWT authentication.
* **Courses:** Teachers can create courses, students can browse and enroll.
* **Live Classrooms:** Real-time chat using WebSockets (STOMP) for interactive sessions.
* **Glassmorphism UI:** Custom CSS design system without heavy component libraries.

## How to run locally

You'll need Java 17+, Node.js 18+, and a MySQL database.

### 1. Database Setup
Create a MySQL database named `fluenta`:
```sql
CREATE DATABASE fluenta;
```
*(Check `src/main/resources/application.yml` if you need to update the username/password, currently defaults to root/root).*

### 2. Start the Backend
The backend runs on `http://localhost:8081`.

```bash
# In the root directory
./mvnw spring-boot:run
```
Flyway will automatically run the migrations and set up the schema.

### 3. Start the Frontend
The frontend runs on `http://localhost:5173`.

```bash
cd client
npm install
npm run dev
```

## Testing the Live Classroom
1. Start both servers.
2. Open two different incognito browser windows at `http://localhost:5173`.
3. Register one account as a Teacher and another as a Student.
4. As the Teacher, create a course.
5. In both windows, click into the course and hit "Join Live Session".
6. You should be able to chat between both windows in real time!
