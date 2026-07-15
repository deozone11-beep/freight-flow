package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rental_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderCode;

    @Column(nullable = false)
    private Long customerId; // User.id, role CUSTOMER

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String packType; // DAILY, MONTHLY, YEARLY

    @Column(nullable = false)
    private Integer duration; // number of days / months / years depending on packType

    @Column(nullable = false)
    private Double ratePerUnit;

    @Column(nullable = false)
    private Double totalAmount;

    private Long warehouseId; // destination warehouse for pickup/storage

    private String pickupAddress;

    @Builder.Default
    private String status = "PENDING_PICKUP";
    // PENDING_PICKUP, PICKUP_ASSIGNED, PICKED_UP, STORED, CANCELLED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
