package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.Passagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PassagemRepository extends JpaRepository<Passagem, Long> {

    List<Passagem> findByColaborador_Registro(String registro);
    List<Passagem> findByDestino(String destino);
    List<Passagem> findByStatus(Passagem.Status status);
    List<Passagem> findByColaborador_RegistroAndStatus(String registro, Passagem.Status status); // ✅ linha nova
}