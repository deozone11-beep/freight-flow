package com.freightflow.backend.repository;

import com.freightflow.backend.entity.WarehouseRegion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRegionRepository extends JpaRepository<WarehouseRegion, Long> {
    boolean existsByRegion(String region);
}
