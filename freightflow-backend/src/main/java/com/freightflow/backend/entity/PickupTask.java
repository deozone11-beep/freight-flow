package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PickupTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String trackingId;

    @Column(nullable = false)
    private Long rentalOrderId;

    @Column(nullable = false)
    private Long warehouseId;

    private Long driverId; // User.id, role DRIVER (nullable until assigned)

    @Builder.Default
    private String assignmentType = "AUTO"; // AUTO, MANUAL

    @Builder.Default
    private String status = "ASSIGNED";
    // ASSIGNED, ACCEPTED, REJECTED, REASSIGNED, PICKED_UP, DELIVERED_TO_WAREHOUSE

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}
