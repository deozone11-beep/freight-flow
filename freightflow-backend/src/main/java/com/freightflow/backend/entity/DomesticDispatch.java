package com.freightflow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "domestic_dispatches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DomesticDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String orderId;

    @NotBlank
    @Column(nullable = false)
    private String wholesalePartner;

    private String batch;

    private String product;

    @NotBlank
    @Column(nullable = false)
    private String destination;

    @Builder.Default
    private String status = "Ready"; // Ready, Dispatched, Delivered
}
