package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // BCrypt hashed password

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    @Builder.Default
    private String role = "ADMIN";

    @Column(nullable = false)
    @Builder.Default
    private boolean mustChangePassword = false;

    // Employee table reference (null for system admin)
    private Long employeeRecordId;

    // Customer mapping
    private Long customerId;

    // Warehouse mapping
    private Long warehouseId;

    // Driver mapping
    private Long driverId;

    private String phoneNumber;

    private Boolean active = true;

    private String passwordResetTokenHash;

    private Instant passwordResetExpiresAt;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}