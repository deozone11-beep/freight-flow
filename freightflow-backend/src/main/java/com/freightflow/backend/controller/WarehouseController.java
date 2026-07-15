package com.freightflow.backend.controller;

import com.freightflow.backend.entity.WarehouseRegion;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.WarehouseRegionRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {

    private final WarehouseRegionRepository repository;

    public WarehouseController(WarehouseRegionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<WarehouseRegion> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public WarehouseRegion create(@Valid @RequestBody WarehouseRegion region) {
        if (repository.existsByRegion(region.getRegion())) {
            throw new DuplicateResourceException("Region already exists: " + region.getRegion());
        }
        region.setId(null);
        return repository.save(region);
    }

    @PutMapping("/{id}")
    public WarehouseRegion update(@PathVariable Long id, @Valid @RequestBody WarehouseRegion updated) {
        WarehouseRegion existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + id));

        existing.setRegion(updated.getRegion());
        existing.setOccupancyPercent(updated.getOccupancyPercent());
        existing.setStatus(updated.getStatus());
        existing.setComponentStock(updated.getComponentStock());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Region not found: " + id);
        }
        repository.deleteById(id);
    }
}
