package com.freightflow.backend.controller;

import com.freightflow.backend.dto.DashboardStatsResponse;
import com.freightflow.backend.repository.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final DomesticDispatchRepository domesticDispatchRepository;
    private final InternationalImportRepository internationalImportRepository;
    private final VehicleRepository vehicleRepository;
    private final WarehouseRegionRepository warehouseRegionRepository;

    public DashboardController(EmployeeRepository employeeRepository,
                                DomesticDispatchRepository domesticDispatchRepository,
                                InternationalImportRepository internationalImportRepository,
                                VehicleRepository vehicleRepository,
                                WarehouseRegionRepository warehouseRegionRepository) {
        this.employeeRepository = employeeRepository;
        this.domesticDispatchRepository = domesticDispatchRepository;
        this.internationalImportRepository = internationalImportRepository;
        this.vehicleRepository = vehicleRepository;
        this.warehouseRegionRepository = warehouseRegionRepository;
    }

    @GetMapping("/stats")
    public DashboardStatsResponse stats() {
        long activeVehicles = vehicleRepository.findAll().stream()
                .filter(v -> "Active".equalsIgnoreCase(v.getStatus()))
                .count();

        long maintenanceVehicles = vehicleRepository.findAll().stream()
                .filter(v -> "Maintenance".equalsIgnoreCase(v.getStatus()))
                .count();

        long totalStock = warehouseRegionRepository.findAll().stream()
                .mapToLong(w -> w.getComponentStock() == null ? 0 : w.getComponentStock())
                .sum();

        return new DashboardStatsResponse(
                employeeRepository.count(),
                domesticDispatchRepository.count(),
                internationalImportRepository.count(),
                vehicleRepository.count(),
                activeVehicles,
                maintenanceVehicles,
                warehouseRegionRepository.count(),
                totalStock
        );
    }
}
