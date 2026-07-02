package com.fluenta.lesson;

import com.fluenta.user.Teacher;
import com.fluenta.user.TeacherRepository;
import com.fluenta.user.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(
            @RequestBody CourseRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Resolve teacher from JWT principal (logged-in user's email)
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        Teacher teacher = teacherRepository.findByUser(user).orElse(null);
        if (teacher == null) return ResponseEntity.badRequest().body("No teacher profile found. Please re-register as a teacher.");

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setLevel(request.getLevel());
        course.setTeacher(teacher);

        return ResponseEntity.ok(courseRepository.save(course));
    }

    @Data
    public static class CourseRequest {
        private String title;
        private String description;
        private String level;
    }
}
