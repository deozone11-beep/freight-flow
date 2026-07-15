package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouse_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long warehouseId;

    @Column(nullable = false)
    private Long productId;

    // The customer who supplied this batch of stock (needed so a company request
    // can be fulfilled from a specific customer's stock, per the requested flow)
    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Integer quantity;

    private Double ratePerUnit;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
