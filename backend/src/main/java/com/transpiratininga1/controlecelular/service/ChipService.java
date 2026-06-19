package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Chip;
import com.transpiratininga1.controlecelular.repository.ChipRepository;
import com.transpiratininga1.controlecelular.repository.VinculoChipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChipService {

    @Autowired
    private ChipRepository chipRepository;

    @Autowired
    private VinculoChipRepository vinculoChipRepository;

    // Listar todos os chips
    public List<Chip> listarTodos() {
        return chipRepository.findAll();
    }

    // Buscar chip por ICCID
    public Optional<Chip> buscarPorIccid(String iccid) {
        return chipRepository.findById(iccid);
    }

    // Cadastrar novo chip
    public Chip cadastrar(Chip chip) {
        if (chipRepository.existsByIccid(chip.getIccid())) {
            throw new IllegalArgumentException("Já existe um chip cadastrado com este ICCID");
        }

        if (chip.getStatus() == null || chip.getStatus().isEmpty()) {
            chip.setStatus("disponivel");
        }

        return chipRepository.save(chip);
    }

    // Atualizar chip
    public Chip atualizar(String iccid, Chip chipAtualizado) {
        Chip chipExistente = chipRepository.findById(iccid)
            .orElseThrow(() -> new IllegalArgumentException("Chip não encontrado com ICCID: " + iccid));

        chipExistente.setNumeroLinha(chipAtualizado.getNumeroLinha());
        chipExistente.setOperadora(chipAtualizado.getOperadora());
        chipExistente.setStatus(chipAtualizado.getStatus());

        return chipRepository.save(chipExistente);
    }

    // Deletar chip (só se não estiver em uso)
    public void deletar(String iccid) {
        Chip chip = chipRepository.findById(iccid)
            .orElseThrow(() -> new IllegalArgumentException("Chip não encontrado com ICCID: " + iccid));

        boolean emUso = vinculoChipRepository.findByChip_IccidAndDataFimIsNull(iccid).isPresent();
        if (emUso) {
            throw new RuntimeException("Não é possível excluir um chip que está em uso em um celular. Remova o vínculo primeiro!");
        }

        chipRepository.deleteById(iccid);
    }

    // Buscar chips por status
    public List<Chip> buscarPorStatus(String status) {
        return chipRepository.findByStatus(status);
    }
}