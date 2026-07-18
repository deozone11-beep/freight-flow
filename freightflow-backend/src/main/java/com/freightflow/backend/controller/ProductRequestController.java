package com.freightflow.backend.controller;

import com.freightflow.backend.entity.ProductRequest;
import com.freightflow.backend.service.ProductRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-requests")
@RequiredArgsConstructor
public class ProductRequestController {

    private final ProductRequestService service;

    @GetMapping
    public List<ProductRequest> getAll() {
        return service.getAllRequests();
    }

    @PostMapping
    public ProductRequest create(
            @RequestBody ProductRequest request) {

        return service.createRequest(request);
    }

    @PutMapping("/{id}/approve")
    public ProductRequest approve(
            @PathVariable Long id) {

        return service.approveRequest(id);
    }

    @PutMapping("/{id}/reject")
    public ProductRequest reject(
            @PathVariable Long id) {

        return service.rejectRequest(id);
    }
}