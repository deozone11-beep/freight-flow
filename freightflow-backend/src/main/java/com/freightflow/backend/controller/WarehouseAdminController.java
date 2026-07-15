package com.freightflow.backend.controller;

import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.WarehouseRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseAdminController {

    private final WarehouseRepository warehouseRepository;

    public WarehouseAdminController(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    // Any authenticated role can list warehouses (needed to pick a warehouse for pickup/delivery)
    @GetMapping
    public List<Warehouse> getAll() {
        return warehouseRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Warehouse create(@Valid @RequestBody Warehouse warehouse) {
        if (warehouseRepository.existsByName(warehouse.getName())) {
            throw new DuplicateResourceException("Warehouse already exists: " + warehouse.getName());
        }
        warehouse.setId(null);
        return warehouseRepository.save(warehouse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Warehouse update(@PathVariable Long id, @Valid @RequestBody Warehouse updated) {
        Warehouse existing = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + id));
        existing.setName(updated.getName());
        existing.setAddress(updated.getAddress());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        existing.setManagerUserId(updated.getManagerUserId());
        existing.setStatus(updated.getStatus());
        return warehouseRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        if (!warehouseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Warehouse not found: " + id);
        }
        warehouseRepository.deleteById(id);
    }
}
