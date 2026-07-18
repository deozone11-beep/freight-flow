package com.freightflow.backend.service;

import com.freightflow.backend.entity.User;
import com.freightflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class PasswordResetService {
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public PasswordResetService(UserRepository userRepository, 
                                org.springframework.beans.factory.ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.userRepository = userRepository;
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    public void createAndSend(User user) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        user.setPasswordResetTokenHash(hash(token));
        user.setPasswordResetExpiresAt(Instant.now().plus(30, ChronoUnit.MINUTES));
        userRepository.save(user);

        String activeFrontendUrl = (frontendUrl == null || frontendUrl.isEmpty() || frontendUrl.startsWith("${"))
                ? "http://localhost:5173"
                : frontendUrl;

        String resetUrl = activeFrontendUrl + "/reset-password?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);

        if (mailSender != null && fromAddress != null && !fromAddress.isEmpty() && !fromAddress.startsWith("${")) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromAddress);
                message.setTo(user.getEmail());
                message.setSubject("FreightFlow password reset");
                message.setText("Use this link to reset your password. It expires in 30 minutes:\n\n" + resetUrl);
                mailSender.send(message);
            } catch (Exception ex) {
                System.err.println("Failed to send email. Logging link instead: " + resetUrl);
                ex.printStackTrace();
            }
        } else {
            System.out.println("==========================================================================");
            System.out.println("MAIL SENDER NOT CONFIGURED or MAIL_USERNAME MISSING. Logging Reset URL:");
            System.out.println(resetUrl);
            System.out.println("==========================================================================");
        }
    }

    public User consumeToken(String token) {
        User user = userRepository
                .findByPasswordResetTokenHashAndPasswordResetExpiresAtAfter(hash(token), Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("This password-reset link is invalid or expired"));
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetExpiresAt(null);
        return user;
    }

    private String hash(String token) {
        try {
            return Base64.getEncoder().encodeToString(
                    MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8))
            );
        } catch (Exception ex) {
            throw new IllegalStateException("Could not secure the password-reset token", ex);
        }
    }
}
