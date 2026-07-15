package com.freightflow.backend.repository;

import com.freightflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.time.Instant;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByPasswordResetTokenHashAndPasswordResetExpiresAtAfter(String tokenHash, Instant now);
}
