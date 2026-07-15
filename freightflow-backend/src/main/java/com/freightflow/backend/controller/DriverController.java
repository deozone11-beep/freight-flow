package com.freightflow.backend.controller;

import com.freightflow.backend.entity.DriverProfile;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DriverProfileRepository;
import com.freightflow.backend.security.AppUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverProfileRepository driverProfileRepository;

    public DriverController(DriverProfileRepository driverProfileRepository) {
        this.driverProfileRepository = driverProfileRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('DRIVER')")
    public DriverProfile me(@AuthenticationPrincipal AppUserDetails principal) {
        return driverProfileRepository.findByUserId(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
    }

    @PostMapping("/me/home-warehouse")
    @PreAuthorize("hasRole('DRIVER')")
    public DriverProfile setHomeWarehouse(@RequestBody Map<String, Long> body, @AuthenticationPrincipal AppUserDetails principal) {
        DriverProfile profile = driverProfileRepository.findByUserId(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
        profile.setHomeWarehouseId(body.get("warehouseId"));
        return driverProfileRepository.save(profile);
    }

    @PostMapping("/me/status")
    @PreAuthorize("hasRole('DRIVER')")
    public DriverProfile setStatus(@RequestBody Map<String, String> body, @AuthenticationPrincipal AppUserDetails principal) {
        DriverProfile profile = driverProfileRepository.findByUserId(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
        profile.setStatus(body.getOrDefault("status", profile.getStatus()));
        return driverProfileRepository.save(profile);
    }

    // Used by the warehouse-manager reassignment UI
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public List<DriverProfile> list(@RequestParam(required = false) Long warehouseId) {
        return warehouseId != null
                ? driverProfileRepository.findByHomeWarehouseId(warehouseId)
                : driverProfileRepository.findAll();
    }
}
