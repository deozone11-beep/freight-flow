package com.freightflow.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationPingRequest {
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
}
