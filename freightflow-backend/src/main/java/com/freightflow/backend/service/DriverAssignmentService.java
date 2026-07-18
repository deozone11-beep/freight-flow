package com.freightflow.backend.service;

import com.freightflow.backend.entity.DriverProfile;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DriverProfileRepository;
import com.freightflow.backend.repository.DeliveryRequestRepository;
import com.freightflow.backend.repository.PickupTaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class DriverAssignmentService {

    private final DriverProfileRepository driverProfileRepository;
    private final PickupTaskRepository pickupTaskRepository;
    private final DeliveryRequestRepository deliveryRequestRepository;
    private final Random random = new Random();

    public DriverAssignmentService(DriverProfileRepository driverProfileRepository,
                                   PickupTaskRepository pickupTaskRepository,
                                   DeliveryRequestRepository deliveryRequestRepository) {
        this.driverProfileRepository = driverProfileRepository;
        this.pickupTaskRepository = pickupTaskRepository;
        this.deliveryRequestRepository = deliveryRequestRepository;
    }

    /**
     * Assigns only AVAILABLE drivers. It first picks the driver(s) with the fewest open
     * pickup and delivery tasks, then chooses randomly among that smallest-load group.
     * This keeps work balanced without always favouring the same driver.
     */
    public Long autoAssignDriver(Long warehouseId) {
        List<DriverProfile> candidates = driverProfileRepository.findByHomeWarehouseIdAndStatus(warehouseId, "AVAILABLE");
        if (candidates.isEmpty()) {
            candidates = driverProfileRepository.findAll().stream()
                    .filter(d -> "AVAILABLE".equals(d.getStatus()))
                    .toList();
        }
        if (candidates.isEmpty()) {
            throw new ResourceNotFoundException("No available drivers to assign right now");
        }
        long smallestLoad = candidates.stream().mapToLong(this::activeLoad).min().orElse(0);
        List<DriverProfile> leastLoaded = candidates.stream()
                .filter(driver -> activeLoad(driver) == smallestLoad)
                .toList();
        DriverProfile chosen = leastLoaded.get(random.nextInt(leastLoaded.size()));
        markBusy(chosen.getUserId());
        return chosen.getUserId();
    }

    private long activeLoad(DriverProfile driver) {
        long pickupLoad = pickupTaskRepository.findByDriverIdOrderByIdDesc(driver.getUserId()).stream()
                .filter(task -> !"DELIVERED_TO_WAREHOUSE".equals(task.getStatus()) && !"REJECTED".equals(task.getStatus()))
                .count();
        long deliveryLoad = deliveryRequestRepository.findByDriverIdOrderByIdDesc(driver.getUserId()).stream()
                .filter(request -> !"DELIVERED".equals(request.getStatus()) && !"CANCELLED".equals(request.getStatus()))
                .count();
        return pickupLoad + deliveryLoad;
    }

    public void markBusy(Long driverUserId) {
        driverProfileRepository.findByUserId(driverUserId).ifPresent(p -> {
            p.setStatus("BUSY");
            driverProfileRepository.save(p);
        });
    }

    public void markAvailable(Long driverUserId) {
        driverProfileRepository.findByUserId(driverUserId).ifPresent(p -> {
            p.setStatus("AVAILABLE");
            driverProfileRepository.save(p);
        });
    }
}
