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


    //listar todas as passagens
    public List<Passagem> listarTodas(){
        return passagemRepository.findAll();
    }


    public Optional<Passagem> buscarPorId(Long id){
        return passagemRepository.findById(id);
    }

    //buscar por colaborador 
    public List<Passagem> buscarPorColaborador(String registro){
        return passagemRepository.findByColaborador_Registro(registro);
    }



    //cadastrar
    public Passagem cadastrar(Passagem passagem){

        //valida que veio um colaborador
        if(passagem.getColaborador() == null || passagem.getColaborador().getRegistro() == null){
           throw new IllegalArgumentException("Colaborador é obrigatório");
        }

        // valida que a data de volta não é antes da ida (se tiver volta)
        if (passagem.getDataVolta() != null && passagem.getDataVolta().isBefore(passagem.getDataIda())) {
            throw new IllegalArgumentException("Data de volta não pode ser antes da data de ida");
        }

        return passagemRepository.save(passagem);
    }

    //atualizar

public Passagem atualizar(Long id, Passagem passagemAtualizada) {
    Passagem existente = passagemRepository.findById(id)
    .orElseThrow(() -> new IllegalArgumentException("Passagem não encontrada"));



        //valida data
        if (passagemAtualizada.getDataVolta() != null && passagemAtualizada.getDataVolta().isBefore(passagemAtualizada.getDataIda())) {
             throw new IllegalArgumentException("Data de volta não pode ser antes da data de ida");
        }

        // copia os campos
        existente.setColaborador(passagemAtualizada.getColaborador());
        existente.setDestino(passagemAtualizada.getDestino());
        existente.setLocalEmbarque(passagemAtualizada.getLocalEmbarque());
        existente.setDataIda(passagemAtualizada.getDataIda());
        existente.setDataVolta(passagemAtualizada.getDataVolta());
        existente.setMotivo(passagemAtualizada.getMotivo());
        existente.setValor(passagemAtualizada.getValor());

        return passagemRepository.save(existente);
        }

        //deletar 
        public void deletar(Long id) {
        Passagem passagem = passagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passagem não encontrada"));
        passagemRepository.delete(passagem);
    }
}


