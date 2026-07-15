package com.freightflow.backend.service;

import com.freightflow.backend.dto.LiveLocationResponse;
import com.freightflow.backend.entity.*;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TrackingService {

    private final LiveLocationRepository liveLocationRepository;
    private final PickupTaskRepository pickupTaskRepository;
    private final DeliveryRequestRepository deliveryRequestRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final WarehouseRepository warehouseRepository;

    public TrackingService(LiveLocationRepository liveLocationRepository,
                            PickupTaskRepository pickupTaskRepository,
                            DeliveryRequestRepository deliveryRequestRepository,
                            RentalOrderRepository rentalOrderRepository,
                            WarehouseRepository warehouseRepository) {
        this.liveLocationRepository = liveLocationRepository;
        this.pickupTaskRepository = pickupTaskRepository;
        this.deliveryRequestRepository = deliveryRequestRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.warehouseRepository = warehouseRepository;
    }

    /** Holder describing who is allowed to view this trackingId, resolved from the underlying task. */
    private record TrackContext(Long warehouseId, Long driverId, Long customerOrCompanyId, String status) {}

    private TrackContext resolveContext(String trackingId) {
        var pickup = pickupTaskRepository.findByTrackingId(trackingId);
        if (pickup.isPresent()) {
            PickupTask t = pickup.get();
            RentalOrder order = rentalOrderRepository.findById(t.getRentalOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rental order not found"));
            return new TrackContext(t.getWarehouseId(), t.getDriverId(), order.getCustomerId(), t.getStatus());
        }
        var delivery = deliveryRequestRepository.findByTrackingId(trackingId);
        if (delivery.isPresent()) {
            DeliveryRequest d = delivery.get();
            return new TrackContext(d.getWarehouseId(), d.getDriverId(), d.getCompanyUserId(), d.getStatus());
        }
        throw new ResourceNotFoundException("No pickup/delivery found for tracking id: " + trackingId);
    }

    public void ping(String trackingId, Long driverUserId, double lat, double lng) {
        TrackContext ctx = resolveContext(trackingId);
        if (ctx.driverId() == null || !ctx.driverId().equals(driverUserId)) {
            throw new IllegalStateException("You are not the driver assigned to this tracking id");
        }

        LiveLocation loc = liveLocationRepository.findByTrackingId(trackingId)
                .orElseGet(() -> LiveLocation.builder().trackingId(trackingId).driverId(driverUserId).build());
        loc.setDriverId(driverUserId);
        loc.setLatitude(lat);
        loc.setLongitude(lng);
        loc.setUpdatedAt(LocalDateTime.now());
        liveLocationRepository.save(loc);
    }

    /**
     * Enforces the 3-way visibility rule: the customer/company on the order, the warehouse
     * manager of that warehouse, or the admin/owner (who can see every warehouse).
     */
    public LiveLocationResponse getForUser(String trackingId, Long userId, String role, Long managerWarehouseId) {
        TrackContext ctx = resolveContext(trackingId);

        boolean allowed = switch (role) {
            case "ADMIN" -> true;
            case "WAREHOUSE_MANAGER" -> managerWarehouseId != null && managerWarehouseId.equals(ctx.warehouseId());
            case "CUSTOMER", "COMPANY" -> userId.equals(ctx.customerOrCompanyId());
            case "DRIVER" -> userId.equals(ctx.driverId());
            default -> false;
        };

        if (!allowed) {
            throw new IllegalStateException("You do not have access to this tracking id");
        }

        LiveLocation loc = liveLocationRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new ResourceNotFoundException("No location has been reported yet for this tracking id"));

        return new LiveLocationResponse(trackingId, loc.getLatitude(), loc.getLongitude(), loc.getUpdatedAt(), ctx.status());
    }
}
