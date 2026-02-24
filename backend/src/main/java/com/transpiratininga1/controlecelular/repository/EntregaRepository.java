package com.transpiratininga1.controlecelular.repository;


import com.transpiratininga1.controlecelular.model.Entrega;
import com.transpiratininga1.controlecelular.model.EntregaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface EntregaRepository extends JpaRepository<Entrega, EntregaId>{

    //Buscr todas as entregas de um celular
    List<Entrega> findById_Imei(String imei);

    //Buscar todas entregas de um colaborador
    List<Entrega> findById_Registro(String registro);

    //buscar por status
    List<Entrega> findByStatus(String status);

    boolean existsById_ImeiAndStatus(String imei, String status);

}