package com.freightflow.backend.repository;

import com.freightflow.backend.entity.DeliveryRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRequestRepository extends JpaRepository<DeliveryRequest, Long> {
    Optional<DeliveryRequest> findByTrackingId(String trackingId);
    List<DeliveryRequest> findByCompanyUserIdOrderByIdDesc(Long companyUserId);
    List<DeliveryRequest> findByWarehouseIdOrderByIdDesc(Long warehouseId);
    List<DeliveryRequest> findByDriverIdOrderByIdDesc(Long driverId);
    List<DeliveryRequest> findAllByOrderByIdDesc();
}
