package com.freightflow.backend.service;

import com.freightflow.backend.entity.MasterProduct;
import com.freightflow.backend.repository.MasterProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterProductService {

    private final MasterProductRepository repository;

    public List<MasterProduct> getAllProducts() {
        return repository.findAll();
    }

    public MasterProduct getProduct(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public MasterProduct createProduct(MasterProduct product) {
        return repository.save(product);
    }

    public MasterProduct updateProduct(Long id, MasterProduct product) {
        MasterProduct existing = getProduct(id);

        existing.setName(product.getName());
        existing.setCategory(product.getCategory());
        existing.setWeight(product.getWeight());
        existing.setLength(product.getLength());
        existing.setWidth(product.getWidth());
        existing.setHeight(product.getHeight());
        existing.setFragile(product.getFragile());
        existing.setHazardous(product.getHazardous());
        existing.setDefaultPrice(product.getDefaultPrice());

        return repository.save(existing);
    }

    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}