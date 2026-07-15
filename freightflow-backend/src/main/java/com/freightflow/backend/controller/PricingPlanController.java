package com.freightflow.backend.controller;

import com.freightflow.backend.dto.QuoteRequest;
import com.freightflow.backend.dto.QuoteResponse;
import com.freightflow.backend.entity.PricingPlan;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.PricingPlanRepository;
import com.freightflow.backend.service.PricingService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
public class PricingPlanController {

    private final PricingPlanRepository pricingPlanRepository;
    private final PricingService pricingService;

    public PricingPlanController(PricingPlanRepository pricingPlanRepository, PricingService pricingService) {
        this.pricingPlanRepository = pricingPlanRepository;
        this.pricingService = pricingService;
    }

    @GetMapping("/plans")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    public List<PricingPlan> getAll() {
        return pricingPlanRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public PricingPlan create(@Valid @RequestBody PricingPlan plan) {
        plan.setId(null);
        plan.setPackType(plan.getPackType().toUpperCase());
        return pricingPlanRepository.save(plan);
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PricingPlan update(@PathVariable Long id, @Valid @RequestBody PricingPlan updated) {
        PricingPlan existing = pricingPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing plan not found: " + id));
        existing.setProductId(updated.getProductId());
        existing.setPackType(updated.getPackType().toUpperCase());
        existing.setMinQuantity(updated.getMinQuantity());
        existing.setRatePerUnit(updated.getRatePerUnit());
        existing.setActive(updated.isActive());
        return pricingPlanRepository.save(existing);
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        pricingPlanRepository.deleteById(id);
    }

    // Customer calls this to see the amount before confirming a rental order
    @PostMapping("/quote")
    public QuoteResponse quote(@Valid @RequestBody QuoteRequest request) {
        return pricingService.quote(request);
    }
}
