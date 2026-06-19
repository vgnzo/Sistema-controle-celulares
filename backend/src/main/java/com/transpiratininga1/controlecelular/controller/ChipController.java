package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Chip;
import com.transpiratininga1.controlecelular.service.ChipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chips")
@CrossOrigin(origins = "*")
public class ChipController {

    @Autowired
    private ChipService chipService;

    // GET /api/chips - listar todos
    @GetMapping
    public ResponseEntity<List<Chip>> listarTodos() {
        return ResponseEntity.ok(chipService.listarTodos());
    }

    // GET /api/chips/{iccid} - buscar por ICCID
    @GetMapping("/{iccid}")
    public ResponseEntity<?> buscarPorIccid(@PathVariable String iccid) {
        Chip chip = chipService.buscarPorIccid(iccid)
            .orElseThrow(() -> new RuntimeException("Chip não encontrado com ICCID: " + iccid));
        return ResponseEntity.ok(chip);
    }

    // POST /api/chips - cadastrar novo chip
    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Chip chip) {
        try {
            Chip novoChip = chipService.cadastrar(chip);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoChip);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/chips/{iccid} - atualizar chip
    @PutMapping("/{iccid}")
    public ResponseEntity<?> atualizar(@PathVariable String iccid, @Valid @RequestBody Chip chip) {
        try {
            Chip chipAtualizado = chipService.atualizar(iccid, chip);
            return ResponseEntity.ok(chipAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/chips/{iccid} - deletar chip
    @DeleteMapping("/{iccid}")
    public ResponseEntity<?> deletar(@PathVariable String iccid) {
        try {
            chipService.deletar(iccid);
            return ResponseEntity.ok("Chip deletado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/chips/status/{status} - buscar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Chip>> buscarPorStatus(@PathVariable String status) {
        return ResponseEntity.ok(chipService.buscarPorStatus(status));
    }
}