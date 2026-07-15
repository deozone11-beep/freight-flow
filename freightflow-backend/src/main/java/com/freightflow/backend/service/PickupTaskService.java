package com.freightflow.backend.service;

import com.freightflow.backend.entity.PickupTask;
import com.freightflow.backend.entity.RentalOrder;
import com.freightflow.backend.entity.WarehouseStock;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.PickupTaskRepository;
import com.freightflow.backend.repository.RentalOrderRepository;
import com.freightflow.backend.repository.WarehouseStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PickupTaskService {

    private final PickupTaskRepository pickupTaskRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final WarehouseStockRepository warehouseStockRepository;
    private final DriverAssignmentService driverAssignmentService;

    public PickupTaskService(PickupTaskRepository pickupTaskRepository,
                              RentalOrderRepository rentalOrderRepository,
                              WarehouseStockRepository warehouseStockRepository,
                              DriverAssignmentService driverAssignmentService) {
        this.pickupTaskRepository = pickupTaskRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.warehouseStockRepository = warehouseStockRepository;
        this.driverAssignmentService = driverAssignmentService;
    }

    private PickupTask get(Long id) {
        return pickupTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup task not found: " + id));
    }

    public PickupTask accept(Long taskId, Long driverId) {
        PickupTask task = get(taskId);
        if (!driverId.equals(task.getDriverId())) {
            throw new IllegalStateException("This pickup task is not assigned to you");
        }
        task.setStatus("ACCEPTED");
        task.setUpdatedAt(LocalDateTime.now());
        return pickupTaskRepository.save(task);
    }

    /** Driver can't make it - frees them up and flags the task for the warehouse manager to reassign. */
    @Transactional
    public PickupTask reject(Long taskId, Long driverId) {
        PickupTask task = get(taskId);
        if (!driverId.equals(task.getDriverId())) {
            throw new IllegalStateException("This pickup task is not assigned to you");
        }
        driverAssignmentService.markAvailable(driverId);
        task.setStatus("REJECTED");
        task.setUpdatedAt(LocalDateTime.now());
        return pickupTaskRepository.save(task);
    }

    /** Warehouse manager / admin interchanges the pickup to another driver (or auto-picks one). */
    @Transactional
    public PickupTask reassign(Long taskId, Long newDriverId, Long warehouseId) {
        PickupTask task = get(taskId);

        if (task.getDriverId() != null) {
            driverAssignmentService.markAvailable(task.getDriverId());
        }

        Long driverId = newDriverId != null ? newDriverId : driverAssignmentService.autoAssignDriver(warehouseId);
        if (newDriverId != null) {
            driverAssignmentService.markBusy(newDriverId);
        }

        task.setDriverId(driverId);
        task.setAssignmentType(newDriverId != null ? "MANUAL" : "AUTO");
        task.setStatus("ASSIGNED");
        task.setUpdatedAt(LocalDateTime.now());
        return pickupTaskRepository.save(task);
    }

    /** Driver has picked up the goods from the customer and dropped them at the warehouse. */
    @Transactional
    public PickupTask complete(Long taskId, Long driverId) {
        PickupTask task = get(taskId);
        if (!driverId.equals(task.getDriverId())) {
            throw new IllegalStateException("This pickup task is not assigned to you");
        }

        RentalOrder order = rentalOrderRepository.findById(task.getRentalOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found"));

        WarehouseStock stock = warehouseStockRepository
                .findByWarehouseIdAndProductIdAndCustomerId(task.getWarehouseId(), order.getProductId(), order.getCustomerId())
                .orElseGet(() -> WarehouseStock.builder()
                        .warehouseId(task.getWarehouseId())
                        .productId(order.getProductId())
                        .customerId(order.getCustomerId())
                        .quantity(0)
                        .ratePerUnit(order.getRatePerUnit())
                        .build());

        stock.setQuantity(stock.getQuantity() + order.getQuantity());
        stock.setRatePerUnit(order.getRatePerUnit());
        stock.setUpdatedAt(LocalDateTime.now());
        warehouseStockRepository.save(stock);

        task.setStatus("DELIVERED_TO_WAREHOUSE");
        task.setUpdatedAt(LocalDateTime.now());
        pickupTaskRepository.save(task);

        order.setStatus("STORED");
        rentalOrderRepository.save(order);

        driverAssignmentService.markAvailable(driverId);
        return task;
    }
}
