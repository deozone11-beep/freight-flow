package com.freightflow.backend.controller;

import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.entity.WarehouseStock;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.WarehouseRepository;
import com.freightflow.backend.repository.WarehouseStockRepository;
import com.freightflow.backend.security.AppUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse-stock")
public class WarehouseStockController {

    private final WarehouseStockRepository warehouseStockRepository;
    private final WarehouseRepository warehouseRepository;

    public WarehouseStockController(WarehouseStockRepository warehouseStockRepository, WarehouseRepository warehouseRepository) {
        this.warehouseStockRepository = warehouseStockRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','COMPANY')")
    public List<WarehouseStock> list(@RequestParam(required = false) Long warehouseId,
                                      @AuthenticationPrincipal AppUserDetails principal) {
        String role = principal.getUser().getRole();

        if ("WAREHOUSE_MANAGER".equals(role)) {
            Warehouse w = warehouseRepository.findByManagerUserId(principal.getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("No warehouse assigned to this manager"));
            return warehouseStockRepository.findByWarehouseId(w.getId());
        }

        if (warehouseId != null) {
            return warehouseStockRepository.findByWarehouseId(warehouseId);
        }
        // ADMIN / COMPANY browsing all stock across warehouses
        return warehouseStockRepository.findAll();
    }
}
