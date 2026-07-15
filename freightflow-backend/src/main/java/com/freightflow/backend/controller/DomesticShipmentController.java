package com.freightflow.backend.controller;

import com.freightflow.backend.entity.DomesticDispatch;
import com.freightflow.backend.exception.DuplicateResourceException;
import com.freightflow.backend.exception.ResourceNotFoundException;
import com.freightflow.backend.repository.DomesticDispatchRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domestic-shipments")
public class DomesticShipmentController {

    private final DomesticDispatchRepository repository;

    public DomesticShipmentController(DomesticDispatchRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DomesticDispatch> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public DomesticDispatch create(@Valid @RequestBody DomesticDispatch dispatch) {
        if (repository.existsByOrderId(dispatch.getOrderId())) {
            throw new DuplicateResourceException("Order ID already exists: " + dispatch.getOrderId());
        }
        dispatch.setId(null);
        return repository.save(dispatch);
    }

    @PutMapping("/{id}")
    public DomesticDispatch update(@PathVariable Long id, @Valid @RequestBody DomesticDispatch updated) {
        DomesticDispatch existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found: " + id));

        existing.setOrderId(updated.getOrderId());
        existing.setWholesalePartner(updated.getWholesalePartner());
        existing.setBatch(updated.getBatch());
        existing.setProduct(updated.getProduct());
        existing.setDestination(updated.getDestination());
        existing.setStatus(updated.getStatus());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Dispatch not found: " + id);
        }
        repository.deleteById(id);
    }
}
