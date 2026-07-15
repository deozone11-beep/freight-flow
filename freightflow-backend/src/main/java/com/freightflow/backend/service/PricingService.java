package com.freightflow.backend.service;

import com.freightflow.backend.dto.QuoteRequest;
import com.freightflow.backend.dto.QuoteResponse;
import com.freightflow.backend.entity.PricingPlan;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.PricingPlanRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PricingService {

    private final PricingPlanRepository pricingPlanRepository;

    public PricingService(PricingPlanRepository pricingPlanRepository) {
        this.pricingPlanRepository = pricingPlanRepository;
    }

    /**
     * Finds the best-matching rate for this product/packType/quantity: a product-specific
     * plan wins over the global default plan, and among matching plans the one with the
     * highest minQuantity that the requested quantity still satisfies wins (so bulk /
     * monthly / yearly packs can offer a cheaper per-unit rate).
     */
    public double resolveRate(Long productId, String packType, int quantity) {
        String type = packType.toUpperCase();

        List<PricingPlan> productPlans = pricingPlanRepository.findByProductIdAndPackTypeAndActiveTrue(productId, type);
        Optional<PricingPlan> best = bestFit(productPlans, quantity);

        if (best.isEmpty()) {
            List<PricingPlan> defaultPlans = pricingPlanRepository.findByProductIdIsNullAndPackTypeAndActiveTrue(type);
            best = bestFit(defaultPlans, quantity);
        }

        return best.orElseThrow(() -> new ResourceNotFoundException(
                "No active pricing plan found for packType=" + type)).getRatePerUnit();
    }

    private Optional<PricingPlan> bestFit(List<PricingPlan> plans, int quantity) {
        return plans.stream()
                .filter(p -> quantity >= p.getMinQuantity())
                .max(Comparator.comparingInt(PricingPlan::getMinQuantity));
    }

    public QuoteResponse quote(QuoteRequest req) {
        double rate = resolveRate(req.getProductId(), req.getPackType(), req.getQuantity());
        double total = computeTotal(rate, req.getQuantity(), req.getDuration());
        return new QuoteResponse(req.getProductId(), req.getQuantity(), req.getPackType().toUpperCase(),
                req.getDuration(), rate, total);
    }

    /** DAILY rate is per unit per day; MONTHLY/YEARLY rate is per unit per pack (duration = number of packs). */
    public double computeTotal(double ratePerUnit, int quantity, int duration) {
        return round2(ratePerUnit * quantity * duration);
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
