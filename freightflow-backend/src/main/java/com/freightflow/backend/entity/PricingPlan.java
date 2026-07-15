package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pricing_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // null productId = default/global plan applied when a product has no specific plan
    private Long productId;

    @Column(nullable = false)
    private String packType; // DAILY, MONTHLY, YEARLY

    @Builder.Default
    private Integer minQuantity = 1;

    @Column(nullable = false)
    private Double ratePerUnit; // rate per unit per day / per unit per month / per unit per year

    @Builder.Default
    private boolean active = true;
}
