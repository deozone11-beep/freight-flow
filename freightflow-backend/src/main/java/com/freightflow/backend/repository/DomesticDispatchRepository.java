package com.freightflow.backend.repository;

import com.freightflow.backend.entity.DomesticDispatch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomesticDispatchRepository extends JpaRepository<DomesticDispatch, Long> {
    boolean existsByOrderId(String orderId);
}
