package com.freightflow.backend.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;
import java.util.Base64;
import java.util.Random;

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
        private final String captchaImage; // Base64 PNG image
        private final String audioObfuscatedText; // Base64 encoded plaintext

        public Captcha(String captchaId, String captchaImage, String audioObfuscatedText) {
            this.captchaId = captchaId;
            this.captchaImage = captchaImage;
            this.audioObfuscatedText = audioObfuscatedText;
        }

        public String getCaptchaId() {
            return captchaId;
        }

        public String getCaptchaImage() {
            return captchaImage;
        }

        public String getAudioObfuscatedText() {
            return audioObfuscatedText;
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

        String captchaImage = generateImageBase64(text);
        String audioObfuscatedText = Base64.getEncoder().encodeToString(text.getBytes(java.nio.charset.StandardCharsets.UTF_8));

        return new Captcha(id, captchaImage, audioObfuscatedText);
    }

    private String generateImageBase64(String text) {
        int width = 160;
        int height = 58;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        
        // Anti-aliasing
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        // Background
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);
        
        // Draw noise lines
        Random rand = new Random();
        Color[] lineColors = {Color.RED, Color.BLUE, Color.GREEN, Color.ORANGE, Color.MAGENTA};
        for (int i = 0; i < 6; i++) {
            g.setColor(lineColors[i % lineColors.length]);
            g.setStroke(new BasicStroke(1));
            g.drawLine(rand.nextInt(width), rand.nextInt(height), rand.nextInt(width), rand.nextInt(height));
        }
        
        // Draw noise dots
        for (int i = 0; i < 40; i++) {
            g.setColor(lineColors[rand.nextInt(lineColors.length)]);
            g.fillOval(rand.nextInt(width), rand.nextInt(height), 2, 2);
        }
        
        // Characters, each rotated/offset/colored independently
        Color[] charColors = {
            new Color(30, 58, 138),
            new Color(124, 45, 18),
            new Color(22, 101, 52),
            new Color(88, 28, 135),
            new Color(157, 23, 77),
            new Color(12, 74, 110)
        };
        
        g.setFont(new Font("Poppins", Font.BOLD, 22));
        int charWidth = width / (text.length() + 1);
        for (int i = 0; i < text.length(); i++) {
            String ch = String.valueOf(text.charAt(i));
            int x = charWidth * (i + 1);
            int y = height / 2 + (rand.nextInt(10) - 5) + 6; // +6 to adjust vertical centering of letters
            
            // Set rotation
            double angle = (rand.nextInt(40) - 20) * (Math.PI / 180.0);
            g.translate(x, y);
            g.rotate(angle);
            g.setColor(charColors[rand.nextInt(charColors.length)]);
            g.drawString(ch, -8, 0); // draw string relative to translate origin
            
            // Restore rotation
            g.rotate(-angle);
            g.translate(-x, -y);
        }
        
        g.dispose();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            ImageIO.write(image, "png", baos);
        } catch (java.io.IOException e) {
            throw new IllegalStateException("Failed to write captcha image", e);
        }
        return Base64.getEncoder().encodeToString(baos.toByteArray());
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
