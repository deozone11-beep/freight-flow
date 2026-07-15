package com.freightflow.backend.controller;

import com.freightflow.backend.entity.InternationalImport;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.InternationalImportRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/international-shipments")
public class InternationalShipmentController {

    private final InternationalImportRepository repository;

    public InternationalShipmentController(InternationalImportRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<InternationalImport> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public InternationalImport create(@Valid @RequestBody InternationalImport importItem) {
        if (repository.existsByImportId(importItem.getImportId())) {
            throw new DuplicateResourceException("Import ID already exists: " + importItem.getImportId());
        }
        importItem.setId(null);
        return repository.save(importItem);
    }

    @PutMapping("/{id}")
    public InternationalImport update(@PathVariable Long id, @Valid @RequestBody InternationalImport updated) {
        InternationalImport existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Import not found: " + id));

        existing.setImportId(updated.getImportId());
        existing.setSupplier(updated.getSupplier());
        existing.setPartType(updated.getPartType());
        existing.setOriginCountry(updated.getOriginCountry());
        existing.setExpectedArrival(updated.getExpectedArrival());
        existing.setCustomsStatus(updated.getCustomsStatus());
        existing.setStatus(updated.getStatus());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Import not found: " + id);
        }
        repository.deleteById(id);
    }
}
