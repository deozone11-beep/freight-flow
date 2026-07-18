package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product_requests")
public class ProductRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    private String productName;

    private String category;

    private Double weight;

    private Integer quantity;

    private Double estimatedAmount;

    private String pickupAddress;

    private String deliveryAddress;

    private String status;
    
    private Long warehouseId;
}