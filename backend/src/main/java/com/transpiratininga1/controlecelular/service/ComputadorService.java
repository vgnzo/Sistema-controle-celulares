package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Computador;
import com.transpiratininga1.controlecelular.repository.ComputadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service 

public class ComputadorService {
    
    @Autowired
    private ComputadorRepository computadorRepository;


    //listar todos
    public List<Computador> listarTodos(){
        return computadorRepository.findAll();
    }


    //buscar por patrimonio
    public Optional<Computador> buscarPorPatrimonio(String numeroPatrimonio){
        return computadorRepository.findById(numeroPatrimonio);

    }


    //cadastrar 
      //cadastrar
    public Computador cadastrar(Computador computador){
        if (computadorRepository.existsByNumeroPatrimonio(computador.getNumeroPatrimonio())) {
            throw new IllegalArgumentException("Já existe um computador com este número de patrimônio");
        }
        if (computador.getStatus() == null || computador.getStatus().isEmpty()) {
        
               computador.setStatus("em estoque");
        }
        return computadorRepository.save(computador);
    }

    //atualizar
    public Computador atualizar(String numeroPatrimonio, Computador computadorAtualizado){
        Computador existente = computadorRepository.findById(numeroPatrimonio)
            .orElseThrow(() -> new IllegalArgumentException("Computador não encontrado: " + numeroPatrimonio));

        existente.setProprietario(computadorAtualizado.getProprietario());
        existente.setMacAddress(computadorAtualizado.getMacAddress());
        existente.setNumeroSerie(computadorAtualizado.getNumeroSerie());
        existente.setMarca(computadorAtualizado.getMarca());
        existente.setModelo(computadorAtualizado.getModelo());
        existente.setStatus(computadorAtualizado.getStatus());
        existente.setDataAquisicao(computadorAtualizado.getDataAquisicao());
        existente.setVidaUtil(computadorAtualizado.getVidaUtil());
        existente.setFornecedor(computadorAtualizado.getFornecedor());
        return computadorRepository.save(existente);
    }

    //deletar
    public void deletar(String numeroPatrimonio){
        if (!computadorRepository.existsById(numeroPatrimonio)) {
            throw new IllegalArgumentException("Computador não encontrado: " + numeroPatrimonio);
        }
        computadorRepository.deleteById(numeroPatrimonio);
    }

    //buscar por status
    public List<Computador> buscarPorStatus(String status){
        return computadorRepository.findByStatus(status);
    }
}