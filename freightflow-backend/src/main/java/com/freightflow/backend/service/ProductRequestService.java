package com.freightflow.backend.service;

import com.freightflow.backend.entity.ProductRequest;
import com.freightflow.backend.repository.ProductRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductRequestService {

    private final ProductRequestRepository repository;

    public List<ProductRequest> getAllRequests() {
        return repository.findAll();
    }

    public ProductRequest createRequest(ProductRequest request) {
        request.setStatus("PENDING");
        return repository.save(request);
    }

    public ProductRequest approveRequest(Long id) {
        ProductRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("APPROVED");

        return repository.save(request);
    }

    public ProductRequest rejectRequest(Long id) {
        ProductRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("REJECTED");

        return repository.save(request);
    }
}