package com.freightflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveLocationResponse {
    private String trackingId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime updatedAt;
    private String status;
}
