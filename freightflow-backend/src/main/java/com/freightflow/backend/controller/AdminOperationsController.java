package com.freightflow.backend.controller;

import com.freightflow.backend.dto.AdminCustomerResponse;
import com.freightflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOperationsController {
    private final UserRepository userRepository;

    @GetMapping("/customers")
    public List<AdminCustomerResponse> customers() {
        return userRepository.findAll().stream()
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .map(AdminCustomerResponse::from)
                .toList();
    }
}
