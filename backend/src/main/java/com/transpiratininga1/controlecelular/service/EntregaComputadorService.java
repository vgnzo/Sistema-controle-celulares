package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Computador;
import com.transpiratininga1.controlecelular.model.EntregaComputador;
import com.transpiratininga1.controlecelular.repository.ComputadorRepository;
import com.transpiratininga1.controlecelular.repository.EntregaComputadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EntregaComputadorService {

    @Autowired
    private EntregaComputadorRepository entregaComputadorRepository;

    @Autowired
    private ComputadorRepository computadorRepository;

    // listar todas as ativas
    public List<EntregaComputador> listarTodas() {
        return entregaComputadorRepository.findByAtivoTrue();
    }

    // histórico completo (ativas + devolvidas)
    public List<EntregaComputador> listarHistorico() {
        return entregaComputadorRepository.findAll();
    }

    // buscar por id
    public Optional<EntregaComputador> buscarPorId(Long id) {
        return entregaComputadorRepository.findById(id);
    }

    // cadastrar
    public EntregaComputador cadastrar(EntregaComputador entrega) {
        // valida status
        if (!entrega.getStatus().matches("ativo|devolvido|atrasado")) {
            throw new IllegalArgumentException("Status inválido. Use: ativo, devolvido ou atrasado");
        }

        String patrimonio = entrega.getComputador().getNumeroPatrimonio();

        // busca o computador
        Computador computador = computadorRepository.findById(patrimonio)
                .orElseThrow(() -> new IllegalArgumentException("Computador não encontrado"));

        // verifica se está disponível
        if (!computador.getStatus().equalsIgnoreCase("em estoque")) {
            throw new IllegalArgumentException("Computador não está disponível para entrega");
        }

        // bloqueia entrega duplicada ativa
        boolean jaEntregue = entregaComputadorRepository
                .existsByComputador_NumeroPatrimonioAndStatus(patrimonio, "ativo");
        if (jaEntregue) {
            throw new IllegalArgumentException("Computador já possui entrega ativa");
        }

        // marca o computador como entregue
        computador.setStatus("entregue");
        computadorRepository.save(computador);

        return entregaComputadorRepository.save(entrega);
    }

    // atualizar
    public EntregaComputador atualizar(Long id, EntregaComputador entregaAtualizada) {
        EntregaComputador existente = entregaComputadorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entrega não encontrada"));

        if (!entregaAtualizada.getStatus().matches("ativo|devolvido|atrasado")) {
            throw new IllegalArgumentException("Status inválido. Use: ativo, devolvido ou atrasado");
        }

        existente.setDataEntrega(entregaAtualizada.getDataEntrega());
        existente.setStatus(entregaAtualizada.getStatus());
        existente.setDepartamento(entregaAtualizada.getDepartamento());
        existente.setAcessorios(entregaAtualizada.getAcessorios());

        // atualiza o status do computador conforme a entrega
        Computador computador = existente.getComputador();
        if (entregaAtualizada.getStatus().equalsIgnoreCase("devolvido")) {
            computador.setStatus("em estoque");
        } else {
            computador.setStatus("entregue");
        }
        computadorRepository.save(computador);

        return entregaComputadorRepository.save(existente);
    }

    // deletar (soft delete)
    public void deletar(Long id) {
        EntregaComputador entrega = entregaComputadorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entrega não encontrada"));

        // se estava ativa, devolve o computador ao estoque
        if (entrega.getStatus().equalsIgnoreCase("ativo")) {
            Computador computador = entrega.getComputador();
            if (computador != null) {
                computador.setStatus("em estoque");
                computadorRepository.save(computador);
            }
        }

        entrega.setAtivo(false);
        entregaComputadorRepository.save(entrega);
    }
}