package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.Chip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChipRepository extends JpaRepository<Chip, String> {

    // Verifica se já existe chip com esse ICCID
    boolean existsByIccid(String iccid);

    // Buscar chips por status (ex: listar só os "disponivel")
    List<Chip> findByStatus(String status);
}