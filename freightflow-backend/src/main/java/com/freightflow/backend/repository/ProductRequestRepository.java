package com.freightflow.backend.repository;

import com.freightflow.backend.entity.ProductRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRequestRepository extends JpaRepository<ProductRequest, Long> {

    List<ProductRequest> findByCustomerId(Long customerId);

    List<ProductRequest> findByStatus(String status);

}