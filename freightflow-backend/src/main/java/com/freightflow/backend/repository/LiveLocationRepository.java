package com.freightflow.backend.repository;

import com.freightflow.backend.entity.LiveLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LiveLocationRepository extends JpaRepository<LiveLocation, Long> {
    Optional<LiveLocation> findByTrackingId(String trackingId);
}
