package com.freightflow.backend.repository;

import com.freightflow.backend.entity.CustomerProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerProductRepository extends JpaRepository<CustomerProduct, Long> {

    List<CustomerProduct> findByCustomerId(Long customerId);

    List<CustomerProduct> findByMasterProductId(Long masterProductId);

    boolean existsByCustomerIdAndCustomerProductName(
            Long customerId,
            String customerProductName
    );
}