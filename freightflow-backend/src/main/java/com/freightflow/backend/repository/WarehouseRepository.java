package com.freightflow.backend.repository;

import com.freightflow.backend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    boolean existsByName(String name);
    Optional<Warehouse> findByManagerUserId(Long managerUserId);
}
