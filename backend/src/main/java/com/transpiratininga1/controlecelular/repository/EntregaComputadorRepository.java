package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.EntregaComputador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EntregaComputadorRepository extends JpaRepository<EntregaComputador, Long> {

    // só as entregas ativas (lista normal)
    List<EntregaComputador> findByAtivoTrue();

    // buscar entregas de um computador específico (pelo patrimônio)
    List<EntregaComputador> findByComputador_NumeroPatrimonio(String numeroPatrimonio);

    // buscar entregas de um colaborador
    List<EntregaComputador> findByColaborador_Registro(String registro);

    // verificar se um computador já tem entrega ativa (pra não entregar duas vezes)
    boolean existsByComputador_NumeroPatrimonioAndStatus(String numeroPatrimonio, String status);
}