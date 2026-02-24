package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Colaborador;
import com.transpiratininga1.controlecelular.service.ColaboradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;



@RestController
@RequestMapping("/api/colaboradores")
public class ColaboradorController {

    @Autowired
    private ColaboradorService colaboradorService;


    //get - lista todos
    @GetMapping
    public ResponseEntity<List<Colaborador>> listarTodos(){
        List<Colaborador> colaboradores = colaboradorService.listarTodos();
        return ResponseEntity.ok(colaboradores);

    }


    //GEt - buscar por registro
    @GetMapping("/{registro}")
    public ResponseEntity<Colaborador> buscarPorRegistro(@PathVariable String registro){
        return colaboradorService.buscarPorRegistro(registro)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());

    }


    //get - buscar por cpf
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Colaborador> buscarPorCpf(@PathVariable String cpf){
        Colaborador colaborador = colaboradorService.buscarPorCpf(cpf);
        if (colaborador != null){
            return ResponseEntity.ok(colaborador);
        }
        return ResponseEntity.notFound().build();
    }


    //Get - buscar por departamento
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<List<Colaborador>> buscarPorDepartamento(@PathVariable String departamento) {
        List<Colaborador> colaboradores = colaboradorService.buscarPorDepartamento(departamento);
        return ResponseEntity.ok(colaboradores);
}

 // GET - Buscar por cargo
    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<Colaborador>> buscarPorCargo(@PathVariable String cargo) {
        List<Colaborador> colaboradores = colaboradorService.buscarPorCargo(cargo);
        return ResponseEntity.ok(colaboradores);
    }
    
    // GET - Buscar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Colaborador>> buscarPorStatus(@PathVariable String status) {
        List<Colaborador> colaboradores = colaboradorService.buscarPorStatus(status);
        return ResponseEntity.ok(colaboradores);
    }
    
    // GET - Buscar por nome
    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<Colaborador>> buscarPorNome(@PathVariable String nome) {
        List<Colaborador> colaboradores = colaboradorService.buscarPorNome(nome);
        return ResponseEntity.ok(colaboradores);

    }

    //Post - cadastrar
    @PostMapping
    public ResponseEntity<Colaborador> cadastrar(@Valid @RequestBody Colaborador colaborador){
        try{
            Colaborador novoColaborador = colaboradorService.cadastrar(colaborador);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoColaborador);
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
    }


   // PUT - Atualizar
@PutMapping("/{registro}")
public ResponseEntity<Colaborador> atualizar(
    @PathVariable String registro,
    @Valid @RequestBody Colaborador colaborador
) {
    try {
        Colaborador colaboradorAtualizado = colaboradorService.atualizar(registro, colaborador);
        return ResponseEntity.ok(colaboradorAtualizado);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}

    //DELETE - deletar
    @DeleteMapping("/{registro}")
    public ResponseEntity<Void> deletar(@PathVariable String registro){
        colaboradorService.deletar(registro);
        return ResponseEntity.noContent().build();
    }

}