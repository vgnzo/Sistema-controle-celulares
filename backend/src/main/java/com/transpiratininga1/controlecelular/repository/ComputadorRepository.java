package com.transpiratininga1.controlecelular.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.transpiratininga1.controlecelular.model.Computador;


import java.util.List;
                                              //entidade computador e o tipo da chave primaria
public interface ComputadorRepository extends JpaRepository<Computador, String> {

    //metodos custumizados - o Spring gera a query pelo nome do metodo

    List<Computador> findByStatus(String status);

    boolean existsByNumeroPatrimonio(String numeroPatrimonio);
}