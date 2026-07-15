package com.freightflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalEmployees;
    private long totalDomesticDispatches;
    private long totalInternationalImports;
    private long totalVehicles;
    private long vehiclesActive;
    private long vehiclesInMaintenance;
    private long warehouseRegions;
    private long totalComponentStock;
}
