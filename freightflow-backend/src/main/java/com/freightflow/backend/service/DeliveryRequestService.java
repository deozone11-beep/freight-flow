package com.freightflow.backend.service;

import com.freightflow.backend.dto.CreateDeliveryRequestDto;
import com.freightflow.backend.entity.DeliveryChargeConfig;
import com.freightflow.backend.entity.DeliveryRequest;
import com.freightflow.backend.entity.Warehouse;
import com.freightflow.backend.entity.WarehouseStock;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DeliveryChargeConfigRepository;
import com.freightflow.backend.repository.DeliveryRequestRepository;
import com.freightflow.backend.repository.WarehouseRepository;
import com.freightflow.backend.repository.WarehouseStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryRequestService {

    private final DeliveryRequestRepository deliveryRequestRepository;
    private final WarehouseStockRepository warehouseStockRepository;
    private final WarehouseRepository warehouseRepository;
    private final DeliveryChargeConfigRepository chargeConfigRepository;
    private final DriverAssignmentService driverAssignmentService;

    public DeliveryRequestService(DeliveryRequestRepository deliveryRequestRepository,
                                   WarehouseStockRepository warehouseStockRepository,
                                   WarehouseRepository warehouseRepository,
                                   DeliveryChargeConfigRepository chargeConfigRepository,
                                   DriverAssignmentService driverAssignmentService) {
        this.deliveryRequestRepository = deliveryRequestRepository;
        this.warehouseStockRepository = warehouseStockRepository;
        this.warehouseRepository = warehouseRepository;
        this.chargeConfigRepository = chargeConfigRepository;
        this.driverAssignmentService = driverAssignmentService;
    }

    @Transactional
    public DeliveryRequest create(Long companyUserId, CreateDeliveryRequestDto req) {
        Warehouse warehouse = warehouseRepository.findById(req.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + req.getWarehouseId()));

        List<WarehouseStock> stockBatches = req.getSourceCustomerId() != null
                ? warehouseStockRepository.findByWarehouseIdAndProductId(req.getWarehouseId(), req.getProductId()).stream()
                    .filter(s -> s.getCustomerId().equals(req.getSourceCustomerId())).toList()
                : warehouseStockRepository.findByWarehouseIdAndProductId(req.getWarehouseId(), req.getProductId());

        int available = stockBatches.stream().mapToInt(WarehouseStock::getQuantity).sum();

        DeliveryRequest.DeliveryRequestBuilder builder = DeliveryRequest.builder()
                .trackingId(RentalOrderService.newCode("DL"))
                .companyUserId(companyUserId)
                .warehouseId(req.getWarehouseId())
                .productId(req.getProductId())
                .sourceCustomerId(req.getSourceCustomerId())
                .requestedQuantity(req.getQuantity())
                .deliveryAddress(req.getDeliveryAddress())
                .deliveryLatitude(req.getDeliveryLatitude())
                .deliveryLongitude(req.getDeliveryLongitude());

        if (available < req.getQuantity()) {
            DeliveryRequest rejected = builder.status("REJECTED_INSUFFICIENT_STOCK").build();
            return deliveryRequestRepository.save(rejected);
        }

        // Deduct stock (FIFO across matching batches)
        int remaining = req.getQuantity();
        double weightedRate = 0;
        for (WarehouseStock batch : stockBatches) {
            if (remaining <= 0) break;
            int take = Math.min(remaining, batch.getQuantity());
            weightedRate += take * (batch.getRatePerUnit() == null ? 0 : batch.getRatePerUnit());
            batch.setQuantity(batch.getQuantity() - take);
            batch.setUpdatedAt(LocalDateTime.now());
            warehouseStockRepository.save(batch);
            remaining -= take;
        }
        double avgRate = weightedRate / req.getQuantity();
        double productAmount = round2(avgRate * req.getQuantity());

        double distanceKm = warehouse.getLatitude() != null && warehouse.getLongitude() != null
                ? GeoUtils.distanceKm(warehouse.getLatitude(), warehouse.getLongitude(),
                    req.getDeliveryLatitude(), req.getDeliveryLongitude())
                : 0;

        double autoCharge = computeAutoCharge(distanceKm);
        double finalAmount = round2(productAmount + autoCharge);

        DeliveryRequest saved = builder
                .productAmount(productAmount)
                .distanceKm(round2(distanceKm))
                .autoDeliveryCharge(autoCharge)
                .finalAmount(finalAmount)
                .status("STOCK_RESERVED")
                .build();
        saved = deliveryRequestRepository.save(saved);

        // Try to auto-assign a driver straight away
        try {
            Long driverId = driverAssignmentService.autoAssignDriver(req.getWarehouseId());
            saved.setDriverId(driverId);
            saved.setStatus("DRIVER_ASSIGNED");
            saved = deliveryRequestRepository.save(saved);
        } catch (ResourceNotFoundException ex) {
            // stays STOCK_RESERVED until a warehouse manager assigns a driver manually
        }

        return saved;
    }

    public double computeAutoCharge(double distanceKm) {
        DeliveryChargeConfig config = chargeConfigRepository.findAll().stream().findFirst()
                .orElseGet(() -> chargeConfigRepository.save(DeliveryChargeConfig.builder().build()));
        return round2(config.getBaseFare() + config.getPerKmRate() * distanceKm + config.getServiceCharge());
    }

    private DeliveryRequest get(Long id) {
        return deliveryRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery request not found: " + id));
    }

    @Transactional
    public DeliveryRequest assignDriver(Long id, Long driverId) {
        DeliveryRequest req = get(id);
        if (req.getDriverId() != null) {
            driverAssignmentService.markAvailable(req.getDriverId());
        }
        Long assigned = driverId != null ? driverId : driverAssignmentService.autoAssignDriver(req.getWarehouseId());
        if (driverId != null) {
            driverAssignmentService.markBusy(driverId);
        }
        req.setDriverId(assigned);
        req.setAssignmentType(driverId != null ? "MANUAL" : "AUTO");
        req.setStatus("DRIVER_ASSIGNED");
        return deliveryRequestRepository.save(req);
    }

    public DeliveryRequest setManualCharge(Long id, Double amount) {
        DeliveryRequest req = get(id);
        req.setManualDeliveryCharge(amount);
        double product = req.getProductAmount() == null ? 0 : req.getProductAmount();
        req.setFinalAmount(round2(product + amount));
        return deliveryRequestRepository.save(req);
    }

    public DeliveryRequest markPickedUp(Long id, Long driverId) {
        DeliveryRequest req = get(id);
        requireOwnDriver(req, driverId);
        req.setStatus("PICKED_UP");
        return deliveryRequestRepository.save(req);
    }

    public DeliveryRequest markOutForDelivery(Long id, Long driverId) {
        DeliveryRequest req = get(id);
        requireOwnDriver(req, driverId);
        req.setStatus("OUT_FOR_DELIVERY");
        return deliveryRequestRepository.save(req);
    }

    @Transactional
    public DeliveryRequest markDelivered(Long id, Long driverId) {
        DeliveryRequest req = get(id);
        requireOwnDriver(req, driverId);
        req.setStatus("DELIVERED");
        driverAssignmentService.markAvailable(driverId);
        return deliveryRequestRepository.save(req);
    }

    private void requireOwnDriver(DeliveryRequest req, Long driverId) {
        if (!driverId.equals(req.getDriverId())) {
            throw new IllegalStateException("This delivery is not assigned to you");
        }
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
