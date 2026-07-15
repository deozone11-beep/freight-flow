package com.freightflow.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ManualChargeRequest {
    @NotNull
    private Double amount;
}
