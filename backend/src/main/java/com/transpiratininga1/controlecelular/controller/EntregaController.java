package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Entrega;
import com.transpiratininga1.controlecelular.service.EntregaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/entregas")
public class EntregaController {

    @Autowired
    private EntregaService entregaService;




    //GET - listar todos
        @GetMapping
    public ResponseEntity<List<Entrega>> listarTodas() {
        List<Entrega> entregas = entregaService.listarTodas();
        return ResponseEntity.ok(entregas);
    }



    //GEt - Buscar por id composto

    @GetMapping("/{imei}/{registro}")
    public ResponseEntity<Entrega> buscarPorId(
        @PathVariable String imei,
        @PathVariable String registro
    ) {
        return entregaService.buscarPorId(imei, registro)
        .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());

    }

    //Get - buscar por celular
    @GetMapping("/celular/{imei}")
    public ResponseEntity<List<Entrega>> buscarPorCelular(@PathVariable String imei){
        List<Entrega> entregas = entregaService.buscarPorcelular(imei);
        return ResponseEntity.ok(entregas);
    }


      // GET - Buscar por colaborador
    @GetMapping("/colaborador/{registro}")
    public ResponseEntity<List<Entrega>> buscarPorColaborador(@PathVariable String registro) {
        List<Entrega> entregas = entregaService.buscarPorColaborador(registro);
        return ResponseEntity.ok(entregas);
    }

    // GET - Buscar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Entrega>> buscarPorStatus(@PathVariable String status) {
        List<Entrega> entregas = entregaService.buscarPorStatus(status);
        return ResponseEntity.ok(entregas);
    }


    //POST - cadastrar

    @PostMapping
    public ResponseEntity<Entrega> cadastar(@Valid @RequestBody Entrega entrega){
        try {
            Entrega novaEntrega = entregaService.cadastrar(entrega);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaEntrega);
            } catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
    }

    //PUT - Atualizar 
    @PutMapping("/{imei}/{registro}")
    public ResponseEntity<Entrega> atualizar(
        @PathVariable String imei,
        @PathVariable String registro,
        @Valid @RequestBody Entrega entrega
    ) {
        try {
            Entrega entregaAtualizada = entregaService.atualizar(imei, registro, entrega);
            return ResponseEntity.ok(entregaAtualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Deletar
    @DeleteMapping("/{imei}/{registro}")
    public ResponseEntity<Void> deletar(
        @PathVariable String imei,
        @PathVariable String registro
    ) {
        entregaService.deletar(imei, registro);
        return ResponseEntity.noContent().build();
    }

}