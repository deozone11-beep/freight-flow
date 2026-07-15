package com.freightflow.backend.controller;

import com.freightflow.backend.entity.Product;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.ProductRepository;
import com.freightflow.backend.security.AppUserDetails;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAll(@AuthenticationPrincipal AppUserDetails principal) {
        String role = principal.getUser().getRole();
        if ("ADMIN".equals(role) || "WAREHOUSE_MANAGER".equals(role) || "COMPANY".equals(role)) {
            return productRepository.findAll();
        }
        return productRepository.findByOwnerUserId(principal.getUser().getId());
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Product> mine(@AuthenticationPrincipal AppUserDetails principal) {
        return productRepository.findByOwnerUserId(principal.getUser().getId());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public Product create(@Valid @RequestBody Product product, @AuthenticationPrincipal AppUserDetails principal) {
        product.setId(null);
        product.setOwnerUserId(principal.getUser().getId());
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product updated,
                           @AuthenticationPrincipal AppUserDetails principal) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        if (!existing.getOwnerUserId().equals(principal.getUser().getId())) {
            throw new IllegalStateException("You can only edit your own products");
        }
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setUnit(updated.getUnit());
        existing.setDescription(updated.getDescription());
        return productRepository.save(existing);
    }
}