package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Celular;
import com.transpiratininga1.controlecelular.repository.CelularRepository;
import com.transpiratininga1.controlecelular.model.Entrega;
import com.transpiratininga1.controlecelular.model.EntregaId;
import com.transpiratininga1.controlecelular.repository.EntregaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EntregaService{

    @Autowired
    private EntregaRepository entregaRepository;

    @Autowired
    private CelularRepository celularRepository;

    public List<Entrega> listarTodas(){
        return entregaRepository.findByAtivoTrue();
    }

    public List<Entrega> listarHistorico(){
        return entregaRepository.findAll();
    }

    public Optional<Entrega> buscarPorId(String imei, String registro){
        EntregaId id = new EntregaId(imei, registro);
        return entregaRepository.findById(id);
    }

    public List<Entrega> buscarPorcelular(String imei){
        return entregaRepository.findById_Imei(imei);
    }

    public List<Entrega> buscarPorColaborador(String registro){
        return entregaRepository.findById_Registro(registro);
    }

    public List<Entrega> buscarPorStatus(String status){
        return entregaRepository.findByStatus(status);
    }

    public Entrega cadastrar(Entrega entrega){
        if (!entrega.getStatus().matches("ativo|devolvido|atrasado")) {
            throw new IllegalArgumentException("Status inválido. Use: ativo, devolvido ou atrasado");
        }

        Celular celular = celularRepository.findById(entrega.getId().getImei())
                .orElseThrow(() -> new RuntimeException("Celular não encontrado"));

        if (!celular.getStatus().equalsIgnoreCase("em estoque")) {
            throw new RuntimeException("Celular não está disponível para entrega");
        }

        boolean existeEntregaAtiva = entregaRepository
                .existsById_ImeiAndStatus(entrega.getId().getImei(), "ativo");

        if (existeEntregaAtiva) {
            throw new RuntimeException("Celular já possui entrega ativa");
        }

        celular.setStatus("entregue");
        celularRepository.save(celular);

        return entregaRepository.save(entrega);
    }

    public Entrega atualizar(String imei, String registro, Entrega entregaAtualizada){
        EntregaId id = new EntregaId(imei, registro);

        return entregaRepository.findById(id)
        .map(entrega ->{
            if(!entregaAtualizada.getStatus().matches("ativo|devolvido|atrasado")){
                throw new IllegalArgumentException("Status inválido. Use: ativo, devolvido ou atrasado");
            }

            entrega.setDataEntrega(entregaAtualizada.getDataEntrega());
            entrega.setStatus(entregaAtualizada.getStatus());
            entrega.setDepartamento(entregaAtualizada.getDepartamento()); // novo
            entrega.setAcessorios(entregaAtualizada.getAcessorios());     // novo

            Celular celular = celularRepository.findById(imei)
                    .orElseThrow(() -> new RuntimeException("Celular não encontrado"));

            if (entregaAtualizada.getStatus().equalsIgnoreCase("devolvido")) {
                celular.setStatus("em estoque");
            } else {
                celular.setStatus("entregue");
            }

            celularRepository.save(celular);

            return entregaRepository.save(entrega);
        })
        .orElseThrow(() -> new RuntimeException("Entrega não encontrada"));
    }

    public void deletar(String imei, String registro){
        EntregaId id = new EntregaId(imei, registro);

        Entrega entrega = entregaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Entrega não encontrada"));

        if (entrega.getStatus().equalsIgnoreCase("ativo")) {
            Celular celular = celularRepository.findById(imei).orElse(null);
            if (celular != null) {
                celular.setStatus("em estoque");
                celularRepository.save(celular);
            }
        }

        entrega.setAtivo(false);
        entregaRepository.save(entrega);
    }
}