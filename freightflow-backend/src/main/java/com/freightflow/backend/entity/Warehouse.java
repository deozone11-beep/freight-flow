package com.freightflow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    private String address;

    private Double latitude;

    private Double longitude;

    // User.id of the WAREHOUSE_MANAGER assigned to this warehouse (nullable until assigned)
    private Long managerUserId;

    @Builder.Default
    private String status = "Active"; // Active, Inactive
}
