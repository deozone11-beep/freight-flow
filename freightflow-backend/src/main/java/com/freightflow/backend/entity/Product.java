package com.freightflow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String category;

    @Builder.Default
    private String unit = "unit"; // kg, box, pcs, unit...

    private String description;

    // User.id of the CUSTOMER who owns/supplies this product
    @Column(nullable = false)
    private Long ownerUserId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
