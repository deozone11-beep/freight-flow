package com.freightflow.backend.repository;

import com.freightflow.backend.entity.PricingPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
// import java.util.Optional;

public interface PricingPlanRepository extends JpaRepository<PricingPlan, Long> {
    List<PricingPlan> findByProductIdAndPackTypeAndActiveTrue(Long productId, String packType);
    List<PricingPlan> findByProductIdIsNullAndPackTypeAndActiveTrue(String packType);
    List<PricingPlan> findAllByOrderByIdDesc();
}
