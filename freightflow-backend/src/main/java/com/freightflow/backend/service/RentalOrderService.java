package com.freightflow.backend.service;

import com.freightflow.backend.dto.CreateRentalOrderRequest;
import com.freightflow.backend.entity.PickupTask;
import com.freightflow.backend.entity.RentalOrder;
import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.PickupTaskRepository;
import com.freightflow.backend.repository.RentalOrderRepository;
import com.freightflow.backend.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final PickupTaskRepository pickupTaskRepository;
    private final WarehouseRepository warehouseRepository;
    private final PricingService pricingService;
    private final DriverAssignmentService driverAssignmentService;

    public RentalOrderService(RentalOrderRepository rentalOrderRepository,
                               PickupTaskRepository pickupTaskRepository,
                               WarehouseRepository warehouseRepository,
                               PricingService pricingService,
                               DriverAssignmentService driverAssignmentService) {
        this.rentalOrderRepository = rentalOrderRepository;
        this.pickupTaskRepository = pickupTaskRepository;
        this.warehouseRepository = warehouseRepository;
        this.pricingService = pricingService;
        this.driverAssignmentService = driverAssignmentService;
    }

    @Transactional
    public RentalOrder createOrder(Long customerId, CreateRentalOrderRequest req) {
        double rate = pricingService.resolveRate(req.getProductId(), req.getPackType(), req.getQuantity());
        double total = pricingService.computeTotal(rate, req.getQuantity(), req.getDuration());

        Long warehouseId = req.getWarehouseId();
        Warehouse warehouse = resolveWarehouse(warehouseId);

        RentalOrder order = RentalOrder.builder()
                .orderCode(newCode("RO"))
                .customerId(customerId)
                .productId(req.getProductId())
                .quantity(req.getQuantity())
                .packType(req.getPackType().toUpperCase())
                .duration(req.getDuration())
                .ratePerUnit(rate)
                .totalAmount(total)
                .warehouseId(warehouse.getId())
                .pickupAddress(req.getPickupAddress())
                .status("PENDING_PICKUP")
                .build();
        order = rentalOrderRepository.save(order);

        // Auto-assign a pickup task to a random available driver
        PickupTask task = PickupTask.builder()
                .trackingId(newCode("PU"))
                .rentalOrderId(order.getId())
                .warehouseId(warehouse.getId())
                .assignmentType("AUTO")
                .status("ASSIGNED")
                .build();

        try {
            Long driverId = driverAssignmentService.autoAssignDriver(warehouse.getId());
            task.setDriverId(driverId);
        } catch (ResourceNotFoundException ex) {
            // No driver available right now - task stays unassigned; warehouse manager can assign manually later
            task.setDriverId(null);
        }

        pickupTaskRepository.save(task);

        order.setStatus("PICKUP_ASSIGNED");
        return rentalOrderRepository.save(order);
    }

    private Warehouse resolveWarehouse(Long warehouseId) {
        if (warehouseId != null) {
            return warehouseRepository.findById(warehouseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + warehouseId));
        }
        List<Warehouse> all = warehouseRepository.findAll();
        if (all.isEmpty()) {
            throw new ResourceNotFoundException("No warehouses configured yet");
        }
        return all.get(0);
    }

    public static String newCode(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
