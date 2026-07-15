package com.freightflow.backend.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    // Characters chosen to avoid easily-confused look-alikes (0/O, 1/I/l).
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 5;
    private static final long TTL_MS = 5 * 60 * 1000; // 5 minutes

    private final Map<String, CaptchaEntry> store = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public static class CaptchaEntry {
        private final String text;
        private final long expiresAt;

        public CaptchaEntry(String text, long expiresAt) {
            this.text = text;
            this.expiresAt = expiresAt;
        }

        public String getText() {
            return text;
        }

        public long getExpiresAt() {
            return expiresAt;
        }
    }

    public static class Captcha {
        private final String captchaId;
        private final String text;

        public Captcha(String captchaId, String text) {
            this.captchaId = captchaId;
            this.text = text;
        }

        public String getCaptchaId() {
            return captchaId;
        }

        public String getText() {
            return text;
        }
    }

    public Captcha generate() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        String text = sb.toString();

        String id = UUID.randomUUID().toString();
        store.put(id, new CaptchaEntry(text, System.currentTimeMillis() + TTL_MS));
        cleanupExpired();

        return new Captcha(id, text);
    }

    // Single-use: the captcha is consumed (removed) whether or not it matches.
    // Case-insensitive comparison since typed captcha text is easy to mistype casing.
    public boolean validate(String captchaId, String submittedAnswer) {
        if (captchaId == null || submittedAnswer == null) {
            return false;
        }

        CaptchaEntry entry = store.remove(captchaId);

        if (entry == null) {
            return false;
        }

        if (System.currentTimeMillis() > entry.getExpiresAt()) {
            return false;
        }

        return entry.getText().equalsIgnoreCase(submittedAnswer.trim());
    }

    private void cleanupExpired() {
        long now = System.currentTimeMillis();
        store.entrySet().removeIf(e -> e.getValue().getExpiresAt() < now);
    }
}
