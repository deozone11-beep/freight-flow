package com.freightflow.backend.repository;

import com.freightflow.backend.entity.DeliveryChargeConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryChargeConfigRepository extends JpaRepository<DeliveryChargeConfig, Long> {
}
