package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "customer_products")
public class CustomerProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    @ManyToOne
    @JoinColumn(name = "master_product_id")
    private MasterProduct masterProduct;

    private String customerProductName;

    private String customerProductCode;

    private Double customerPrice;
}