package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.EntregaComputador;
import com.transpiratininga1.controlecelular.service.EntregaComputadorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entregas-computador")
public class EntregaComputadorController {

    @Autowired
    private EntregaComputadorService entregaComputadorService;

    // GET - listar todas as ativas
    @GetMapping
    public ResponseEntity<List<EntregaComputador>> listarTodas() {
        return ResponseEntity.ok(entregaComputadorService.listarTodas());
    }

    // GET - histórico completo
    @GetMapping("/historico")
    public ResponseEntity<List<EntregaComputador>> listarHistorico() {
        return ResponseEntity.ok(entregaComputadorService.listarHistorico());
    }

    // GET - buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<EntregaComputador> buscarPorId(@PathVariable Long id) {
        return entregaComputadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - cadastrar
    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody EntregaComputador entrega) {
        try {
            EntregaComputador nova = entregaComputadorService.cadastrar(entrega);
            return ResponseEntity.status(HttpStatus.CREATED).body(nova);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - atualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody EntregaComputador entrega) {
        try {
            EntregaComputador atualizada = entregaComputadorService.atualizar(id, entrega);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - deletar (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            entregaComputadorService.deletar(id);
            return ResponseEntity.ok("Entrega deletada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}