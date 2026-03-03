package com.transpiratininga1.controlecelular.service;
import com.transpiratininga1.controlecelular.exception.ColaboradorComEntregasException;
import com.transpiratininga1.controlecelular.model.Colaborador;
import com.transpiratininga1.controlecelular.repository.ColaboradorRepository;
import com.transpiratininga1.controlecelular.repository.EntregaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ColaboradorService {
    
    @Autowired
    private ColaboradorRepository colaboradorRepository;
    
     @Autowired
    private EntregaRepository entregaRepository;


    // Listar todos
    public List<Colaborador> listarTodos() {
        return colaboradorRepository.findAll();
    }

    //buscar por registro 
    public Optional<Colaborador> buscarPorRegistro(String registro){
        return colaboradorRepository.findById(registro);
    }

    //bucar por cpf 
    public Colaborador buscarPorCpf(String cpf){
        return colaboradorRepository.findByCpf(cpf);
    }


     // Buscar por departamento
    public List<Colaborador> buscarPorDepartamento(String departamento) {
        return colaboradorRepository.findByDepartamento(departamento);
    }
    
    // Buscar por cargo
    public List<Colaborador> buscarPorCargo(String cargo) {
        return colaboradorRepository.findByCargo(cargo);
    }
    
    // Buscar por status
    public List<Colaborador> buscarPorStatus(String status) {
        return colaboradorRepository.findByStatus(status);
    }
    
    // Buscar por nome
    public List<Colaborador> buscarPorNome(String nome) {
        return colaboradorRepository.findByNomeContainingIgnoreCase(nome);
    }


    //cadastrar
    public Colaborador cadastrar(Colaborador colaborador) {
        //valida o status
        if(!colaborador.getStatus().matches("ativo|inativo")){
            throw new IllegalArgumentException("Status inválido; Use: ativo ou inativo");
        }

        //verifica se o cpf ja existe
        if (colaboradorRepository.findByCpf(colaborador.getCpf()) !=null) {
             throw new IllegalArgumentException("CPF já cadastrado");
        }

        return colaboradorRepository.save(colaborador);
    }


    //atualizar
    public Colaborador atualizar(String registro, Colaborador colaboradorAtualizado) {
        return colaboradorRepository.findById(registro)
            .map(colaborador -> {
                // Validar status
                if (!colaboradorAtualizado.getStatus().matches("ativo|inativo")) {
                    throw new IllegalArgumentException("Status inválido. Use: ativo ou inativo");
                }
                

            // ✅ ADICIONE AQUI:
            if (colaboradorAtualizado.getStatus().equalsIgnoreCase("inativo")) {
                boolean temEntregaAtiva = entregaRepository
                    .existsById_RegistroAndStatusAndAtivoTrue(registro, "ativo");
                boolean temEntregaAtrasada = entregaRepository
                    .existsById_RegistroAndStatusAndAtivoTrue(registro, "atrasado");

                if (temEntregaAtiva || temEntregaAtrasada) {
                    throw new RuntimeException("Não é possível inativar colaborador com entrega ativa ou atrasada. Devolva o celular primeiro!");
                }
                 List<com.transpiratininga1.controlecelular.model.Entrega> entregasDevolvidas = 
        entregaRepository.findById_Registro(registro)
            .stream()
            .filter(e -> e.getStatus().equalsIgnoreCase("devolvido") && e.getAtivo())
            .collect(java.util.stream.Collectors.toList());

    entregasDevolvidas.forEach(e -> {
        e.setAtivo(false);
        entregaRepository.save(e);
    });

            }



                colaborador.setNome(colaboradorAtualizado.getNome());
                colaborador.setCpf(colaboradorAtualizado.getCpf());
                colaborador.setEmail(colaboradorAtualizado.getEmail());
                colaborador.setTelefoneContato(colaboradorAtualizado.getTelefoneContato());
                colaborador.setDepartamento(colaboradorAtualizado.getDepartamento());
                colaborador.setCargo(colaboradorAtualizado.getCargo());
                colaborador.setDataAdmissao(colaboradorAtualizado.getDataAdmissao());
                colaborador.setStatus(colaboradorAtualizado.getStatus());
                
                return colaboradorRepository.save(colaborador);
            })
            .orElseThrow(() -> new RuntimeException("Colaborador não encontrado com registro: " + registro));
    }
    
    // Deletar
public void deletar(String registro) throws ColaboradorComEntregasException {
    try {
        colaboradorRepository.deleteById(registro);
    } catch (Exception e) {
        throw new ColaboradorComEntregasException("Não é possível excluir o colaborador pois possui entregas vinculadas");
    }
}
}

