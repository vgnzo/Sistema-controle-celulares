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

    // 🔥 ADICIONADO: controle de celular
    @Autowired
    private CelularRepository celularRepository;

    //listar todas
    public List<Entrega> listarTodas(){
    return entregaRepository.findByAtivoTrue();
}


// Adicione após o listarTodas():
public List<Entrega> listarHistorico(){
    return entregaRepository.findAll(); // retorna TODAS, ativas e deletadas
}

    //buscar por id 
    public Optional<Entrega> buscarPorId(String imei, String registro){
        EntregaId id = new EntregaId(imei, registro);
        return entregaRepository.findById(id);
    }

    //buscar por celular
    public List<Entrega> buscarPorcelular(String imei){
        return entregaRepository.findById_Imei(imei);
    }

    public List<Entrega> buscarPorColaborador(String registro){
        return entregaRepository.findById_Registro(registro);
    }

    //Buscar por status
    public List<Entrega> buscarPorStatus(String status){
        return entregaRepository.findByStatus(status);
    }

    //cadastrar
    public Entrega cadastrar(Entrega entrega){
        //valida o status
        if (!entrega.getStatus().matches("ativo|devolvido|atrasado")) {
            throw new IllegalArgumentException("Status inválido. Use: ativo, devolvido ou atrasado");
        }

        // 🔥 buscar celular
        Celular celular = celularRepository.findById(entrega.getId().getImei())
                .orElseThrow(() -> new RuntimeException("Celular não encontrado"));

        // 🔥 verificar se está disponível
        if (!celular.getStatus().equalsIgnoreCase("em estoque")) {
            throw new RuntimeException("Celular não está disponível para entrega");
        }

        // 🔥 bloquear entrega duplicada ativa
        boolean existeEntregaAtiva = entregaRepository
                .existsById_ImeiAndStatus(entrega.getId().getImei(), "ativo");

        if (existeEntregaAtiva) {
            throw new RuntimeException("Celular já possui entrega ativa");
        }

        // 🔥 atualizar status do celular
        celular.setStatus("entregue");
        celularRepository.save(celular);

        return entregaRepository.save(entrega);
    }

   //atualizar
public Entrega atualizar(String imei, String registro, Entrega entregaAtualizada){
    EntregaId id = new EntregaId(imei, registro);

    return entregaRepository.findById(id)
    .map(entrega ->{
        if(!entregaAtualizada.getStatus().matches("ativo|devolvido|atrasado")){
            throw new IllegalArgumentException("Status inválido. Use: ativo, devolvido ou atrasado");
        }

        entrega.setDataEntrega(entregaAtualizada.getDataEntrega());
        entrega.setDataPrevistaDevolucao(entregaAtualizada.getDataPrevistaDevolucao());
        entrega.setStatus(entregaAtualizada.getStatus());

        // 🔥 buscar celular
        Celular celular = celularRepository.findById(imei)
                .orElseThrow(() -> new RuntimeException("Celular não encontrado"));

        // 🔥 atualizar status do celular baseado na entrega
        // se devolvido → volta para estoque
        if (entregaAtualizada.getStatus().equalsIgnoreCase("devolvido")) {
            celular.setStatus("em estoque");
        } 
        // se ativo ou atrasado → continua entregue
        else {
            celular.setStatus("entregue");
        }

        celularRepository.save(celular);

        return entregaRepository.save(entrega);
    })
    .orElseThrow(() -> new RuntimeException("Entrega não encontrada"));
}

    //deletar
   public void deletar(String imei, String registro){
    EntregaId id = new EntregaId(imei, registro);

    Entrega entrega = entregaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Entrega não encontrada"));

    // devolve celular ao estoque se estava ativo (mantém lógica original)
    if (entrega.getStatus().equalsIgnoreCase("ativo")) {
        Celular celular = celularRepository.findById(imei).orElse(null);
        if (celular != null) {
            celular.setStatus("em estoque");
            celularRepository.save(celular);
        }
    }

    // soft delete: não apaga, só desativa
    entrega.setAtivo(false);
    entregaRepository.save(entrega);
    }

}