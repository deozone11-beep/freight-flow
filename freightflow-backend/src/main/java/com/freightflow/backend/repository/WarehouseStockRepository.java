package com.freightflow.backend.repository;

import com.freightflow.backend.entity.WarehouseStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WarehouseStockRepository extends JpaRepository<WarehouseStock, Long> {
    List<WarehouseStock> findByWarehouseId(Long warehouseId);
    List<WarehouseStock> findByWarehouseIdAndProductId(Long warehouseId, Long productId);
    Optional<WarehouseStock> findByWarehouseIdAndProductIdAndCustomerId(Long warehouseId, Long productId, Long customerId);
}
