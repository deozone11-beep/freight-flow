package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "master_products")
public class MasterProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String productCode;

    private String name;

    private String category;

    private Double weight;

    private Double length;

    private Double width;

    private Double height;

    private Boolean fragile;

    private Boolean hazardous;

    private Double defaultPrice;
}