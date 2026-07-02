package com.fluenta.classroom;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class ClassSessionController {

    private final ClassSessionRepository classSessionRepository;

    @GetMapping
    public List<ClassSession> getAllSessions() {
        return classSessionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassSession> getSessionById(@PathVariable Long id) {
        return classSessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ClassSession createSession(@RequestBody ClassSession session) {
        return classSessionRepository.save(session);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        if (!classSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        classSessionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
