package com.freightflow.backend.controller;

import com.freightflow.backend.dto.AuthResponse;
import com.freightflow.backend.dto.CaptchaResponse;
import com.freightflow.backend.dto.ChangePasswordRequest;
import com.freightflow.backend.dto.ForgotPasswordRequest;
import com.freightflow.backend.dto.LoginRequest;
import com.freightflow.backend.dto.RegisterRequest;
import com.freightflow.backend.dto.ResetPasswordRequest;
import com.freightflow.backend.entity.DriverProfile;
import com.freightflow.backend.entity.Employee;
import com.freightflow.backend.entity.User;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DriverProfileRepository;
import com.freightflow.backend.repository.EmployeeRepository;
import com.freightflow.backend.repository.UserRepository;
import com.freightflow.backend.security.AppUserDetails;
import com.freightflow.backend.security.CaptchaService;
import com.freightflow.backend.security.JwtUtil;
import com.freightflow.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CaptchaService captchaService;
    private final PasswordResetService passwordResetService;

    private static final java.util.Set<String> SELF_SIGNUP_ROLES = java.util.Set.of("CUSTOMER", "COMPANY", "DRIVER");

    public AuthController(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           EmployeeRepository employeeRepository,
                           DriverProfileRepository driverProfileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           CaptchaService captchaService,
                           PasswordResetService passwordResetService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.captchaService = captchaService;
        this.passwordResetService = passwordResetService;
    }

    @GetMapping("/captcha")
    public CaptchaResponse captcha() {
        CaptchaService.Captcha c = captchaService.generate();
        return new CaptchaResponse(c.getCaptchaId(), c.getText());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        if (!captchaService.validate(request.getCaptchaId(), request.getCaptchaAnswer())) {
            throw new BadCredentialsException("Incorrect captcha answer. Please try again.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole(), user.isMustChangePassword());
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken");
        }

        String role = request.getRole() == null ? "CUSTOMER" : request.getRole().toUpperCase();
        if (!SELF_SIGNUP_ROLES.contains(role)) {
            throw new IllegalArgumentException("Self-signup is only allowed for CUSTOMER, COMPANY or DRIVER accounts");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail().trim().toLowerCase())
                .role(role)
                .mustChangePassword(false)
                .build();

        user = userRepository.save(user);

        if ("DRIVER".equals(role)) {
            DriverProfile profile = DriverProfile.builder()
                    .userId(user.getId())
                    .vehicleNumber(request.getVehicleNumber())
                    .phone(request.getPhone())
                    .status("AVAILABLE")
                    .build();
            driverProfileRepository.save(profile);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole(), false);
    }

    @GetMapping("/me")
    public AuthResponse me(@org.springframework.security.core.annotation.AuthenticationPrincipal AppUserDetails principal) {
        User user = principal.getUser();
        return new AuthResponse(null, user.getUsername(), user.getFullName(), user.getRole(), user.isMustChangePassword());
    }

    // Logged-in user changes their own password (used both for voluntary changes
    // and for the forced "first login" password change flow).
    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal AppUserDetails principal) {

        User user = principal.getUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);

        Map<String, String> body = new HashMap<>();
        body.put("message", "Password updated successfully");
        return body;
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userRepository.findByEmailIgnoreCase(request.getEmail())
                .ifPresent(passwordResetService::createAndSend);

        Map<String, String> body = new HashMap<>();
        body.put("message", "If an account exists for that email, a password-reset link has been sent.");
        return body;
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = passwordResetService.consumeToken(request.getToken());
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);

        return Map.of("message", "Password updated successfully. Please log in.");
    }
}
