package com.freightflow.backend.dto;

import com.freightflow.backend.entity.User;

import java.time.Instant;

/** Safe customer data for the owner dashboard: deliberately excludes password/reset fields. */
public record AdminCustomerResponse(Long id, String fullName, String username, String email,
                                    String phoneNumber, Boolean active, Instant createdAt) {
    public static AdminCustomerResponse from(User user) {
        return new AdminCustomerResponse(user.getId(), user.getFullName(), user.getUsername(), user.getEmail(),
                user.getPhoneNumber(), user.getActive(), user.getCreatedAt());
    }
}
