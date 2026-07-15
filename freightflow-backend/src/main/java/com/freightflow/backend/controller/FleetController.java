package com.freightflow.backend.controller;

import com.freightflow.backend.entity.Vehicle;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fleet")
public class FleetController {

    private final VehicleRepository repository;

    public FleetController(VehicleRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Vehicle> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Vehicle create(@Valid @RequestBody Vehicle vehicle) {
        if (repository.existsByVehicleNumber(vehicle.getVehicleNumber())) {
            throw new DuplicateResourceException("Vehicle number already exists: " + vehicle.getVehicleNumber());
        }
        vehicle.setId(null);
        return repository.save(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle update(@PathVariable Long id, @Valid @RequestBody Vehicle updated) {
        Vehicle existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));

        existing.setVehicleNumber(updated.getVehicleNumber());
        existing.setDriverName(updated.getDriverName());
        existing.setRoute(updated.getRoute());
        existing.setStatus(updated.getStatus());
        existing.setSafetyScore(updated.getSafetyScore());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle not found: " + id);
        }
        repository.deleteById(id);
    }
}
