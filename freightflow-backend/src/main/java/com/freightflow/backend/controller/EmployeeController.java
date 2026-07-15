package com.freightflow.backend.controller;

import com.freightflow.backend.entity.Employee;
import com.freightflow.backend.entity.User;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.EmployeeRepository;
import com.freightflow.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository repository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeController(EmployeeRepository repository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Employee> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    @PostMapping
    public Employee create(@Valid @RequestBody Employee employee) {
        if (repository.existsByEmployeeId(employee.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID already exists: " + employee.getEmployeeId());
        }
        employee.setId(null);
        Employee saved = repository.save(employee);

        // Auto-provision a login for this employee:
        //   username = employeeId (e.g. "EMP-1234")
        //   password = "<employeeId>@123"  (they must change it on first login)
        // Skipped if that username is somehow already taken.
        if (!userRepository.existsByUsername(saved.getEmployeeId())) {
            String systemRole = "WAREHOUSE_MANAGER".equalsIgnoreCase(saved.getRole()) ? "WAREHOUSE_MANAGER" : "STAFF";
            User loginAccount = User.builder()
                    .username(saved.getEmployeeId())
                    .password(passwordEncoder.encode(saved.getEmployeeId() + "@123"))
                    .fullName(saved.getName())
                    .email(saved.getEmail())
                    .role(systemRole)
                    .mustChangePassword(true)
                    .employeeRecordId(saved.getId())
                    .build();
            userRepository.save(loginAccount);
        }

        return saved;
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id, @Valid @RequestBody Employee updated) {
        Employee existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        String oldEmployeeId = existing.getEmployeeId();

        existing.setEmployeeId(updated.getEmployeeId());
        existing.setName(updated.getName());
        existing.setRole(updated.getRole());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());

        Employee saved = repository.save(existing);

        // Keep the linked login account's username/name in sync if the employee ID or name changed.
        Optional<User> linkedUser = userRepository.findByUsername(oldEmployeeId);
        linkedUser.ifPresent(user -> {
            user.setUsername(saved.getEmployeeId());
            user.setFullName(saved.getName());
            user.setEmail(saved.getEmail());
            userRepository.save(user);
        });

        return saved;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        userRepository.findByUsername(employee.getEmployeeId())
                .ifPresent(userRepository::delete);

        repository.deleteById(id);
    }
}
