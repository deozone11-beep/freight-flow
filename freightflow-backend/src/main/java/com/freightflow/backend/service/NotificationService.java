package com.freightflow.backend.service;

import com.freightflow.backend.entity.Notification;
import com.freightflow.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public List<Notification> getNotifications(Long userId) {
        return repository.findByUserId(userId);
    }

    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        return repository.save(notification);
    }

    public Notification markAsRead(Long id) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        return repository.save(notification);
    }
}