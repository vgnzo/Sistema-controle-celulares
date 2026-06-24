package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Passagem;
import com.transpiratininga1.controlecelular.repository.PassagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PassagemService {

    @Autowired
    private PassagemRepository passagemRepository;

    public List<Passagem> listarTodas() {
        return passagemRepository.findAll();
    }

    public Optional<Passagem> buscarPorId(Long id) {
        return passagemRepository.findById(id);
    }

    public List<Passagem> buscarPorColaborador(String registro) {
        return passagemRepository.findByColaborador_Registro(registro);
    }

    // ✅ NOVO — retorna só as pendentes (pra aba de aprovações do admin)
    public List<Passagem> listarPendentes() {
        return passagemRepository.findByStatus(Passagem.Status.PENDENTE);
    }

    // ✅ NOVO — retorna as do colaborador logado (pra tela do user)
    public List<Passagem> buscarPorColaboradorEStatus(String registro, Passagem.Status status) {
        if (status != null) {
            return passagemRepository.findByColaborador_RegistroAndStatus(registro, status);
        }
        return passagemRepository.findByColaborador_Registro(registro);
    }

    public Passagem cadastrar(Passagem passagem) {
        // colaborador é opcional agora; se vier vazio, zera pra não dar erro de vínculo
        if (passagem.getColaborador() == null || passagem.getColaborador().getRegistro() == null
                || passagem.getColaborador().getRegistro().isBlank()) {
            passagem.setColaborador(null);
        }
        if (passagem.getDataVolta() != null && passagem.getDataIda() != null
                && passagem.getDataVolta().isBefore(passagem.getDataIda())) {
            throw new IllegalArgumentException("Data de volta não pode ser antes da data de ida");
        }
        // garante que sempre começa PENDENTE, independente do que veio no body
        passagem.setStatus(Passagem.Status.PENDENTE);
        passagem.setObservacao(null);
        return passagemRepository.save(passagem);
    }

    public Passagem atualizar(Long id, Passagem passagemAtualizada) {
        Passagem existente = passagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passagem não encontrada"));

        if (passagemAtualizada.getDataVolta() != null && passagemAtualizada.getDataVolta().isBefore(passagemAtualizada.getDataIda())) {
            throw new IllegalArgumentException("Data de volta não pode ser antes da data de ida");
        }

        existente.setColaborador(passagemAtualizada.getColaborador());
        existente.setSolicitanteNome(passagemAtualizada.getSolicitanteNome());
        existente.setSolicitanteRegistro(passagemAtualizada.getSolicitanteRegistro());
        existente.setDestino(passagemAtualizada.getDestino());
        existente.setLocalEmbarque(passagemAtualizada.getLocalEmbarque());
        existente.setLocalEmbarqueVolta(passagemAtualizada.getLocalEmbarqueVolta());
        existente.setDataIda(passagemAtualizada.getDataIda());
        existente.setDataVolta(passagemAtualizada.getDataVolta());
        existente.setMotivo(passagemAtualizada.getMotivo());
        existente.setValor(passagemAtualizada.getValor());

        return passagemRepository.save(existente);
    }

    // ✅ NOVO — admin aprova
    public Passagem aprovar(Long id) {
        Passagem passagem = passagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passagem não encontrada"));

        if (passagem.getStatus() != Passagem.Status.PENDENTE) {
            throw new IllegalArgumentException("Somente solicitações pendentes podem ser aprovadas");
        }

        passagem.setStatus(Passagem.Status.APROVADO);
        passagem.setObservacao(null);
        return passagemRepository.save(passagem);
    }

    // ✅ NOVO — admin rejeita com observação
    public Passagem rejeitar(Long id, String observacao) {
        Passagem passagem = passagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passagem não encontrada"));

        if (passagem.getStatus() != Passagem.Status.PENDENTE) {
            throw new IllegalArgumentException("Somente solicitações pendentes podem ser rejeitadas");
        }

        passagem.setStatus(Passagem.Status.REJEITADO);
        passagem.setObservacao(observacao);
        return passagemRepository.save(passagem);
    }

    public void deletar(Long id) {
        Passagem passagem = passagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passagem não encontrada"));
        passagemRepository.delete(passagem);
    }
}