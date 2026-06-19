package com.transpiratininga1.controlecelular.repository;

import com.transpiratininga1.controlecelular.model.VinculoChip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VinculoChipRepository extends JpaRepository<VinculoChip, Long> {

    // Busca todo o histórico de vínculos de um celular (passado e presente)
    List<VinculoChip> findByCelular_ImeiOrderByDataInicioDesc(String imei);

    // Busca todo o histórico de vínculos de um chip (passado e presente)
    List<VinculoChip> findByChip_IccidOrderByDataInicioDesc(String iccid);

    // Busca o vínculo ATIVO de um celular (dataFim = null = ainda está usando)
    Optional<VinculoChip> findByCelular_ImeiAndDataFimIsNull(String imei);

    // Busca o vínculo ATIVO de um chip (pra saber se já está em uso em algum celular)
    Optional<VinculoChip> findByChip_IccidAndDataFimIsNull(String iccid);
}