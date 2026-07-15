package com.freightflow.backend.controller;

import com.freightflow.backend.dto.LiveLocationResponse;
import com.freightflow.backend.dto.LocationPingRequest;
import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.repository.WarehouseRepository;
import com.freightflow.backend.security.AppUserDetails;
import com.freightflow.backend.service.TrackingService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;
    private final WarehouseRepository warehouseRepository;

    public TrackingController(TrackingService trackingService, WarehouseRepository warehouseRepository) {
        this.trackingService = trackingService;
        this.warehouseRepository = warehouseRepository;
    }

    @PostMapping("/{trackingId}/location")
    @PreAuthorize("hasRole('DRIVER')")
    public void ping(@PathVariable String trackingId, @Valid @RequestBody LocationPingRequest req,
                      @AuthenticationPrincipal AppUserDetails principal) {
        trackingService.ping(trackingId, principal.getUser().getId(), req.getLatitude(), req.getLongitude());
    }

    @GetMapping("/{trackingId}")
    public LiveLocationResponse get(@PathVariable String trackingId, @AuthenticationPrincipal AppUserDetails principal) {
        String role = principal.getUser().getRole();
        Long managerWarehouseId = null;
        if ("WAREHOUSE_MANAGER".equals(role)) {
            managerWarehouseId = warehouseRepository.findByManagerUserId(principal.getUser().getId())
                    .map(Warehouse::getId).orElse(null);
        }
        return trackingService.getForUser(trackingId, principal.getUser().getId(), role, managerWarehouseId);
    }
}
