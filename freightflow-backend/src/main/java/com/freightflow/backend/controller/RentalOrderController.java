package com.freightflow.backend.controller;

import com.freightflow.backend.dto.CreateRentalOrderRequest;
import com.freightflow.backend.entity.PickupTask;
import com.freightflow.backend.entity.RentalOrder;
import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.PickupTaskRepository;
import com.freightflow.backend.repository.RentalOrderRepository;
import com.freightflow.backend.repository.WarehouseRepository;
import com.freightflow.backend.security.AppUserDetails;
import com.freightflow.backend.service.RentalOrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rental-orders")
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;
    private final RentalOrderRepository rentalOrderRepository;
    private final PickupTaskRepository pickupTaskRepository;
    private final WarehouseRepository warehouseRepository;

    public RentalOrderController(RentalOrderService rentalOrderService,
                                  RentalOrderRepository rentalOrderRepository,
                                  PickupTaskRepository pickupTaskRepository,
                                  WarehouseRepository warehouseRepository) {
        this.rentalOrderService = rentalOrderService;
        this.rentalOrderRepository = rentalOrderRepository;
        this.pickupTaskRepository = pickupTaskRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public RentalOrder create(@Valid @RequestBody CreateRentalOrderRequest req, @AuthenticationPrincipal AppUserDetails principal) {
        return rentalOrderService.createOrder(principal.getUser().getId(), req);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<RentalOrder> mine(@AuthenticationPrincipal AppUserDetails principal) {
        return rentalOrderRepository.findByCustomerIdOrderByIdDesc(principal.getUser().getId());
    }

    @GetMapping("/{id}/pickup-task")
    public PickupTask pickupTaskFor(@PathVariable Long id) {
        return pickupTaskRepository.findByRentalOrderId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No pickup task for order " + id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public List<RentalOrder> getAll(@AuthenticationPrincipal AppUserDetails principal) {
        if ("ADMIN".equals(principal.getUser().getRole())) {
            return rentalOrderRepository.findAllByOrderByIdDesc();
        }
        Warehouse w = warehouseRepository.findByManagerUserId(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("No warehouse assigned to this manager"));
        return rentalOrderRepository.findByWarehouseIdOrderByIdDesc(w.getId());
    }
}
