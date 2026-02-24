package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Celular;
import com.transpiratininga1.controlecelular.repository.CelularRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//autowired injeçaõ de dependecia, o spring cria o celularRepository e injeta automaticamnete
//optional é um container q pd ter valor ou pd ter nada, evita null e nullpointerexecption

import java.util.List;
import java.util.Optional;


@Service 
public class CelularService{

    @Autowired
    private CelularRepository celularRepository;


    //listar todos os celulares

    public List<Celular> listarTodos() {
        return celularRepository.findAll();
    }


    //busca o celulares por IMEI
    public Optional<Celular> buscarPorImei(String imei){
        return celularRepository.findById(imei);
    }

    //cadastrar novo celular

    public Celular cadastrar(Celular celular){
        //verifica se ja existe celular com esse IMEI
        if (celularRepository.existsByImei(celular.getImei())){
            throw new IllegalArgumentException("já existe um celular cadastrado com este IMEI");
        }

        //garante q o status inicial seja "em estoque"
        if (celular.getStatus() == null || celular.getStatus().isEmpty()){
            celular.setStatus("em estoque");
        }

        return celularRepository.save(celular);
    }


    //atualizar celular

    public Celular atualizar(String imei, Celular celularAtualizado){
        //busca celular existente
        Celular celularExistente = celularRepository.findById(imei)
        .orElseThrow(() -> new IllegalArgumentException("Celular não encontrado com IMEI:" + imei));


        //atualiza os campos 
        celularExistente.setModelo(celularAtualizado.getModelo());
        celularExistente.setStatus(celularAtualizado.getStatus());
        celularExistente.setFornecedor(celularAtualizado.getFornecedor());
        celularExistente.setDataAquisicao(celularAtualizado.getDataAquisicao());
        celularExistente.setVidaUtil(celularAtualizado.getVidaUtil());

         return celularRepository.save(celularExistente);
    }


  //metodo de deletar o celular
public void deletar(String imei) {

    Celular celular = celularRepository.findById(imei)
        .orElseThrow(() -> new IllegalArgumentException("Celular não encontrado com IMEI: " + imei));

    String status = celular.getStatus().toLowerCase().trim();

    if (!status.equals("em estoque")) {
        throw new RuntimeException("Só é possível excluir celular que esteja EM ESTOQUE");
    }

    celularRepository.deleteById(imei);
}


    //buscar os celulares por status
    public List<Celular> buscarPorStatus(String status){
        return celularRepository.findByStatus(status);

    }

    //buscar o celular por modelo

    public List<Celular> buscarPorModelo(String modelo){
        return celularRepository.findByModeloContainingIgnoreCase(modelo);

    }

    //atualizar apenas por status do celular

    public Celular atualizarStatus(String imei, String novoStatus){
        Celular celular = celularRepository.findById(imei)
        .orElseThrow(() -> new IllegalArgumentException("Celular não encontrado com IMEI:" + imei));

        celular.setStatus(novoStatus);
            return celularRepository.save(celular);
        
    }
}
