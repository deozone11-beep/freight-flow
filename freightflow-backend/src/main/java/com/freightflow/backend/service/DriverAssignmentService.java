package com.freightflow.backend.service;

import com.freightflow.backend.entity.DriverProfile;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DriverProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class DriverAssignmentService {

    private final DriverProfileRepository driverProfileRepository;
    private final Random random = new Random();

    public DriverAssignmentService(DriverProfileRepository driverProfileRepository) {
        this.driverProfileRepository = driverProfileRepository;
    }

    /** Randomly assigns any AVAILABLE driver based at the warehouse; falls back to any AVAILABLE driver. */
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
        DriverProfile chosen = candidates.get(random.nextInt(candidates.size()));
        markBusy(chosen.getUserId());
        return chosen.getUserId();
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
