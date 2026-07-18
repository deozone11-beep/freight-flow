package com.freightflow.backend.controller;

import com.freightflow.backend.entity.Notification;
import com.freightflow.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(
            @PathVariable Long userId) {

        return service.getNotifications(userId);
    }

    @PostMapping
    public Notification create(
            @RequestBody Notification notification) {

        return service.createNotification(notification);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id) {

        return service.markAsRead(id);
    }
}