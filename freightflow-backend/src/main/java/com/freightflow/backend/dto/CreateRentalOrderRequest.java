package com.freightflow.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRentalOrderRequest {
    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String packType;

    @NotNull
    @Min(1)
    private Integer duration;

    private Long warehouseId; // optional, auto-picked if null

    private String pickupAddress;
}
