package com.freightflow.backend.dto;

import lombok.Data;

@Data
public class ReassignDriverRequest {
    private Long driverId; // null = auto pick
}
