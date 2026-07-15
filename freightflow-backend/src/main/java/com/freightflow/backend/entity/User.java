package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

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
    private String password; // BCrypt hashed

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    @Builder.Default
    private String role = "ADMIN"; // ADMIN, MANAGER, STAFF, WAREHOUSE_MANAGER, DRIVER, CUSTOMER, COMPANY

    @Column(nullable = false)
    @Builder.Default
    private boolean mustChangePassword = false;

    // DB id of the Employee this login belongs to (null for the system admin account)
    private Long employeeRecordId;

    private String passwordResetTokenHash;

    private Instant passwordResetExpiresAt;
}
