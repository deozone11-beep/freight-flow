package com.freightflow.backend.repository;

import com.freightflow.backend.entity.MasterProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterProductRepository extends JpaRepository<MasterProduct, Long> {

    Optional<MasterProduct> findByProductCode(String productCode);

    Optional<MasterProduct> findByName(String name);

    boolean existsByProductCode(String productCode);
}