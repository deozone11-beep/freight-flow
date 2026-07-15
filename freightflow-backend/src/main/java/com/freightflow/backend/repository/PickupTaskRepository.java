package com.freightflow.backend.repository;

import com.freightflow.backend.entity.PickupTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PickupTaskRepository extends JpaRepository<PickupTask, Long> {
    Optional<PickupTask> findByTrackingId(String trackingId);
    Optional<PickupTask> findByRentalOrderId(Long rentalOrderId);
    List<PickupTask> findByDriverIdOrderByIdDesc(Long driverId);
    List<PickupTask> findByWarehouseIdOrderByIdDesc(Long warehouseId);
}
