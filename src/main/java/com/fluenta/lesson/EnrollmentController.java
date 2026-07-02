package com.fluenta.lesson;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;

    @GetMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public Enrollment enrollStudent(@RequestBody Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }
}
