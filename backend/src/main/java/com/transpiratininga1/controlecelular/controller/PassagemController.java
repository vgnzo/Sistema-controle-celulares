package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Passagem;
import com.transpiratininga1.controlecelular.service.PassagemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/passagens")
public class PassagemController {

    @Autowired
    private PassagemService passagemService;

    @GetMapping
    public ResponseEntity<List<Passagem>> listarTodas() {
        return ResponseEntity.ok(passagemService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Passagem> buscarPorId(@PathVariable Long id) {
        return passagemService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ NOVO — admin busca os pendentes
    @GetMapping("/pendentes")
    public ResponseEntity<List<Passagem>> listarPendentes() {
        return ResponseEntity.ok(passagemService.listarPendentes());
    }

    // ✅ NOVO — user vê as próprias (passa registro na URL)
    @GetMapping("/colaborador/{registro}")
    public ResponseEntity<List<Passagem>> buscarPorColaborador(@PathVariable String registro) {
        return ResponseEntity.ok(passagemService.buscarPorColaborador(registro));
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Passagem passagem) {
        try {
            Passagem nova = passagemService.cadastrar(passagem);
            return ResponseEntity.status(HttpStatus.CREATED).body(nova);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Passagem passagem) {
        try {
            Passagem atualizada = passagemService.atualizar(id, passagem);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NOVO — admin aprova
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        try {
            Passagem aprovada = passagemService.aprovar(id);
            return ResponseEntity.ok(aprovada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NOVO — admin rejeita (body: { "observacao": "motivo aqui" })
    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String observacao = body.getOrDefault("observacao", "");
            Passagem rejeitada = passagemService.rejeitar(id, observacao);
            return ResponseEntity.ok(rejeitada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

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