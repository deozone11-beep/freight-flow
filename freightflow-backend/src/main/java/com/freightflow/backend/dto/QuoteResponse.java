package com.freightflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuoteResponse {
    private Long productId;
    private Integer quantity;
    private String packType;
    private Integer duration;
    private Double ratePerUnit;
    private Double totalAmount;
}
