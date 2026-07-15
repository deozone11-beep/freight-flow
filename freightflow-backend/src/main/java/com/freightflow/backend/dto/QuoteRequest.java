package com.freightflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class QuoteRequest {
    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String packType; // DAILY, MONTHLY, YEARLY

    @NotNull
    @Min(1)
    private Integer duration; // days / months / years
}
