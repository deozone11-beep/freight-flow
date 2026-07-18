package com.freightflow.backend.controller;

import com.freightflow.backend.entity.MasterProduct;
import com.freightflow.backend.service.MasterProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master-products")
@RequiredArgsConstructor
public class MasterProductController {

    private final MasterProductService service;

    @GetMapping
    public List<MasterProduct> getAll() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public MasterProduct get(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @PostMapping
    public MasterProduct create(@RequestBody MasterProduct product) {
        return service.createProduct(product);
    }

    @PutMapping("/{id}")
    public MasterProduct update(
            @PathVariable Long id,
            @RequestBody MasterProduct product) {

        return service.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteProduct(id);
    }
}