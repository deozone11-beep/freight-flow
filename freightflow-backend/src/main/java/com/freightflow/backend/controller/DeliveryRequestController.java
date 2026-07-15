package com.freightflow.backend.controller;

import com.freightflow.backend.dto.CreateDeliveryRequestDto;
import com.freightflow.backend.dto.ManualChargeRequest;
import com.freightflow.backend.dto.ReassignDriverRequest;
import com.freightflow.backend.entity.DeliveryRequest;
import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DeliveryRequestRepository;
import com.freightflow.backend.repository.WarehouseRepository;
import com.freightflow.backend.security.AppUserDetails;
import com.freightflow.backend.service.DeliveryRequestService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-requests")
public class DeliveryRequestController {

    private final DeliveryRequestService deliveryRequestService;
    private final DeliveryRequestRepository deliveryRequestRepository;
    private final WarehouseRepository warehouseRepository;

    public DeliveryRequestController(DeliveryRequestService deliveryRequestService,
                                      DeliveryRequestRepository deliveryRequestRepository,
                                      WarehouseRepository warehouseRepository) {
        this.deliveryRequestService = deliveryRequestService;
        this.deliveryRequestRepository = deliveryRequestRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public DeliveryRequest create(@Valid @RequestBody CreateDeliveryRequestDto req, @AuthenticationPrincipal AppUserDetails principal) {
        return deliveryRequestService.create(principal.getUser().getId(), req);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('COMPANY')")
    public List<DeliveryRequest> mine(@AuthenticationPrincipal AppUserDetails principal) {
        return deliveryRequestRepository.findByCompanyUserIdOrderByIdDesc(principal.getUser().getId());
    }

    @GetMapping("/assigned-to-me")
    @PreAuthorize("hasRole('DRIVER')")
    public List<DeliveryRequest> assignedToMe(@AuthenticationPrincipal AppUserDetails principal) {
        return deliveryRequestRepository.findByDriverIdOrderByIdDesc(principal.getUser().getId());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public List<DeliveryRequest> getAll(@AuthenticationPrincipal AppUserDetails principal) {
        if ("ADMIN".equals(principal.getUser().getRole())) {
            return deliveryRequestRepository.findAllByOrderByIdDesc();
        }
        Warehouse w = warehouseRepository.findByManagerUserId(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("No warehouse assigned to this manager"));
        return deliveryRequestRepository.findByWarehouseIdOrderByIdDesc(w.getId());
    }

    @PostMapping("/{id}/assign-driver")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public DeliveryRequest assignDriver(@PathVariable Long id, @RequestBody ReassignDriverRequest req) {
        return deliveryRequestService.assignDriver(id, req.getDriverId());
    }

    @PostMapping("/{id}/manual-charge")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public DeliveryRequest setManualCharge(@PathVariable Long id, @Valid @RequestBody ManualChargeRequest req) {
        return deliveryRequestService.setManualCharge(id, req.getAmount());
    }

    @PostMapping("/{id}/picked-up")
    @PreAuthorize("hasRole('DRIVER')")
    public DeliveryRequest pickedUp(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails principal) {
        return deliveryRequestService.markPickedUp(id, principal.getUser().getId());
    }

    @PostMapping("/{id}/out-for-delivery")
    @PreAuthorize("hasRole('DRIVER')")
    public DeliveryRequest outForDelivery(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails principal) {
        return deliveryRequestService.markOutForDelivery(id, principal.getUser().getId());
    }

    @PostMapping("/{id}/delivered")
    @PreAuthorize("hasRole('DRIVER')")
    public DeliveryRequest delivered(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails principal) {
        return deliveryRequestService.markDelivered(id, principal.getUser().getId());
    }
}
