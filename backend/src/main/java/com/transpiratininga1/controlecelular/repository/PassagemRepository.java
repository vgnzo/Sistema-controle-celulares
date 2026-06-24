package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.Passagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface PassagemRepository extends JpaRepository<Passagem, Long> {

    //busca todas as passagens de um colaborador especifico
    List<Passagem> findByColaborador_Registro (String registro);

    //busca passagens por destino
    List<Passagem> findByDestino(String destino);
}