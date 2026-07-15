package com.freightflow.backend.repository;

import com.freightflow.backend.entity.RentalOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalOrderRepository extends JpaRepository<RentalOrder, Long> {
    boolean existsByOrderCode(String orderCode);
    List<RentalOrder> findByCustomerIdOrderByIdDesc(Long customerId);
    List<RentalOrder> findByWarehouseIdOrderByIdDesc(Long warehouseId);
    List<RentalOrder> findAllByOrderByIdDesc();
}
