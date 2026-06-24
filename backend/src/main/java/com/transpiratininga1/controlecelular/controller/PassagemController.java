package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Passagem;
import com.transpiratininga1.controlecelular.service.PassagemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/passagens")

public class PassagemController {

    @Autowired
    private PassagemService passagemService;



    //Get - listar todos 
    @GetMapping
    public ResponseEntity<List<Passagem>> listarTodas() {
        return ResponseEntity.ok(passagemService.listarTodas());
    }


    //get - buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<Passagem> buscarPorId(@PathVariable Long id){
        return passagemService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    //Post cadastrar

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Passagem passagem) {
        try {
            Passagem nova = passagemService.cadastrar(passagem);
            return ResponseEntity.status(HttpStatus.CREATED).body(nova);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
                

        }
    }


    //Put - atualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Passagem passagem ){
try {
            Passagem atualizada = passagemService.atualizar(id, passagem);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            passagemService.deletar(id);
            return ResponseEntity.ok("Passagem deletada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}