package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String trackingId;

    @Column(nullable = false)
    private Long companyUserId; // User.id, role COMPANY

    @Column(nullable = false)
    private Long warehouseId;

    @Column(nullable = false)
    private Long productId;

    // stock is drawn from this specific customer's batch in the warehouse
    private Long sourceCustomerId;

    @Column(nullable = false)
    private Integer requestedQuantity;

    @Column(nullable = false)
    private String deliveryAddress;

    private Double deliveryLatitude;

    private Double deliveryLongitude;

    private Double distanceKm;

    private Double productAmount; // requestedQuantity * ratePerUnit at time of request

    private Double autoDeliveryCharge; // baseFare + perKmRate * distanceKm + serviceCharge

    private Double manualDeliveryCharge; // optional override entered by warehouse manager/admin

    private Double finalAmount; // productAmount + (manualDeliveryCharge if set else autoDeliveryCharge)

    private Long driverId;

    @Builder.Default
    private String assignmentType = "AUTO";

    @Builder.Default
    private String status = "REQUESTED";
    // REQUESTED, STOCK_RESERVED, REJECTED_INSUFFICIENT_STOCK, DRIVER_ASSIGNED,
    // PICKED_UP, OUT_FOR_DELIVERY, DELIVERED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
