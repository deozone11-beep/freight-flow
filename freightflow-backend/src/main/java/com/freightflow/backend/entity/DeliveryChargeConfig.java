package com.freightflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "delivery_charge_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryChargeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private Double baseFare = 50.0; // flat pickup/dispatch charge

    @Builder.Default
    private Double perKmRate = 12.0; // petrol + transport cost per km

    @Builder.Default
    private Double serviceCharge = 20.0; // handling/service charge
}
