package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "driver_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId; // FK -> User.id (role = DRIVER)

    private String vehicleNumber;

    private String phone;

    // Warehouse this driver is based out of / currently working under
    private Long homeWarehouseId;

    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, BUSY, OFFLINE
}
