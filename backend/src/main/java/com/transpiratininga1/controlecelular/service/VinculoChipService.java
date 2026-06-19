package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Celular;
import com.transpiratininga1.controlecelular.model.Chip;
import com.transpiratininga1.controlecelular.model.VinculoChip;
import com.transpiratininga1.controlecelular.repository.CelularRepository;
import com.transpiratininga1.controlecelular.repository.ChipRepository;
import com.transpiratininga1.controlecelular.repository.VinculoChipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VinculoChipService {

    @Autowired
    private VinculoChipRepository vinculoChipRepository;

    @Autowired
    private ChipRepository chipRepository;

    @Autowired
    private CelularRepository celularRepository;

    // Histórico completo de chips de um celular
    public List<VinculoChip> historicoPorCelular(String imei) {
        return vinculoChipRepository.findByCelular_ImeiOrderByDataInicioDesc(imei);
    }

    // Histórico completo de celulares que um chip já passou
    public List<VinculoChip> historicoPorChip(String iccid) {
        return vinculoChipRepository.findByChip_IccidOrderByDataInicioDesc(iccid);
    }

    // Qual chip está em um celular AGORA
    public Optional<VinculoChip> chipAtualDoCelular(String imei) {
        return vinculoChipRepository.findByCelular_ImeiAndDataFimIsNull(imei);
    }

    // Vincular um chip a um celular (coloca um chip novo no aparelho)
    public VinculoChip vincular(String iccid, String imei) {

        Chip chip = chipRepository.findById(iccid)
            .orElseThrow(() -> new IllegalArgumentException("Chip não encontrado com ICCID: " + iccid));

        Celular celular = celularRepository.findById(imei)
            .orElseThrow(() -> new IllegalArgumentException("Celular não encontrado com IMEI: " + imei));

        // Verifica se esse chip já está em uso em outro celular
        boolean chipJaEmUso = vinculoChipRepository.findByChip_IccidAndDataFimIsNull(iccid).isPresent();
        if (chipJaEmUso) {
            throw new RuntimeException("Esse chip já está em uso em outro celular!");
        }

        // Se o celular já tem um chip ativo, fecha o vínculo antigo automaticamente
        Optional<VinculoChip> vinculoAntigo = vinculoChipRepository.findByCelular_ImeiAndDataFimIsNull(imei);
        if (vinculoAntigo.isPresent()) {
            VinculoChip antigo = vinculoAntigo.get();
            antigo.setDataFim(LocalDate.now());
            vinculoChipRepository.save(antigo);

            // O chip antigo volta a ficar "disponivel"
            Chip chipAntigo = antigo.getChip();
            chipAntigo.setStatus("disponivel");
            chipRepository.save(chipAntigo);
        }

        // Cria o novo vínculo
        VinculoChip novoVinculo = new VinculoChip();
        novoVinculo.setChip(chip);
        novoVinculo.setCelular(celular);
        novoVinculo.setDataInicio(LocalDate.now());
        novoVinculo.setDataFim(null);

        // Marca o chip novo como "em uso"
        chip.setStatus("em uso");
        chipRepository.save(chip);

        return vinculoChipRepository.save(novoVinculo);
    }

    // Desvincular chip do celular (tira o chip, sem colocar outro)
    public void desvincular(String imei) {
        VinculoChip vinculo = vinculoChipRepository.findByCelular_ImeiAndDataFimIsNull(imei)
            .orElseThrow(() -> new IllegalArgumentException("Esse celular não tem chip vinculado no momento"));

        vinculo.setDataFim(LocalDate.now());
        vinculoChipRepository.save(vinculo);

        Chip chip = vinculo.getChip();
        chip.setStatus("disponivel");
        chipRepository.save(chip);
    }
}