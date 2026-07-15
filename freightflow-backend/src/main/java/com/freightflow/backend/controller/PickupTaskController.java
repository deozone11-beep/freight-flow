package com.freightflow.backend.controller;

import com.freightflow.backend.dto.ReassignDriverRequest;
import com.freightflow.backend.entity.PickupTask;
import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.PickupTaskRepository;
import com.freightflow.backend.repository.WarehouseRepository;
import com.freightflow.backend.security.AppUserDetails;
import com.freightflow.backend.service.PickupTaskService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickup-tasks")
public class PickupTaskController {

    private final PickupTaskService pickupTaskService;
    private final PickupTaskRepository pickupTaskRepository;
    private final WarehouseRepository warehouseRepository;

    public PickupTaskController(PickupTaskService pickupTaskService,
                                 PickupTaskRepository pickupTaskRepository,
                                 WarehouseRepository warehouseRepository) {
        this.pickupTaskService = pickupTaskService;
        this.pickupTaskRepository = pickupTaskRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('DRIVER')")
    public List<PickupTask> mine(@AuthenticationPrincipal AppUserDetails principal) {
        return pickupTaskRepository.findByDriverIdOrderByIdDesc(principal.getUser().getId());
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public PickupTask accept(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails principal) {
        return pickupTaskService.accept(id, principal.getUser().getId());
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('DRIVER')")
    public PickupTask reject(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails principal) {
        return pickupTaskService.reject(id, principal.getUser().getId());
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('DRIVER')")
    public PickupTask complete(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails principal) {
        return pickupTaskService.complete(id, principal.getUser().getId());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public List<PickupTask> getAll(@AuthenticationPrincipal AppUserDetails principal) {
        if ("ADMIN".equals(principal.getUser().getRole())) {
            return pickupTaskRepository.findAll();
        }
        Warehouse w = warehouseRepository.findByManagerUserId(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("No warehouse assigned to this manager"));
        return pickupTaskRepository.findByWarehouseIdOrderByIdDesc(w.getId());
    }

    // Warehouse manager "interchanges" a pickup to another driver when the assigned one can't go
    @PostMapping("/{id}/reassign")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public PickupTask reassign(@PathVariable Long id, @RequestBody ReassignDriverRequest req,
                                @AuthenticationPrincipal AppUserDetails principal) {
        PickupTask task = pickupTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup task not found: " + id));

        if ("WAREHOUSE_MANAGER".equals(principal.getUser().getRole())) {
            Warehouse w = warehouseRepository.findByManagerUserId(principal.getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("No warehouse assigned to this manager"));
            if (!w.getId().equals(task.getWarehouseId())) {
                throw new IllegalStateException("This pickup task belongs to a different warehouse");
            }
        }

        return pickupTaskService.reassign(id, req.getDriverId(), task.getWarehouseId());
    }
}
