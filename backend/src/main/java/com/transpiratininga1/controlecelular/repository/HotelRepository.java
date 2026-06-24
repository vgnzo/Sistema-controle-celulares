package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>{


     List<Hotel> findByStatus(Hotel.Status status);
    //buscar todas as reservas de um colaborador especifico
    List<Hotel> findByColaborador_Registro(String registro);
}