package com.freightflow.backend.repository;

import com.freightflow.backend.entity.InternationalImport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InternationalImportRepository extends JpaRepository<InternationalImport, Long> {
    boolean existsByImportId(String importId);
}
