package com.freightflow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "international_imports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternationalImport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String importId;

    @NotBlank
    @Column(nullable = false)
    private String supplier;

    private String partType;

    private String originCountry;

    private String expectedArrival; // stored as string (yyyy-MM-dd) to match frontend date input

    private String customsStatus;

    @Builder.Default
    private String status = "Pending";
}
