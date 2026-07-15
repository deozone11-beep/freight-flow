package com.freightflow.backend.repository;

import com.freightflow.backend.entity.DriverProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DriverProfileRepository extends JpaRepository<DriverProfile, Long> {
    Optional<DriverProfile> findByUserId(Long userId);
    List<DriverProfile> findByHomeWarehouseIdAndStatus(Long homeWarehouseId, String status);
    List<DriverProfile> findByHomeWarehouseId(Long homeWarehouseId);
}
