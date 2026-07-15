package com.freightflow.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDeliveryRequestDto {
    @NotNull
    private Long warehouseId;

    @NotNull
    private Long productId;

    private Long sourceCustomerId; // optional: request from a specific customer's stock batch

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String deliveryAddress;

    @NotNull
    private Double deliveryLatitude;

    @NotNull
    private Double deliveryLongitude;
}
