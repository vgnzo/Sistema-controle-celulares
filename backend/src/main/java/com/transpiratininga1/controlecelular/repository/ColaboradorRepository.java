package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository 
public interface ColaboradorRepository extends JpaRepository<Colaborador, String> {

    //buscar cpf
    Colaborador findByCpf(String cpf);

    //buscar por departamento
    List<Colaborador> findByDepartamento(String departamento);

    //buscar por cargo 
    List<Colaborador> findByCargo(String cargo);

    //buscar por status
    List<Colaborador> findByStatus(String status);

    //buscar por nome 
    List<Colaborador> findByNomeContainingIgnoreCase(String nome);
    
}