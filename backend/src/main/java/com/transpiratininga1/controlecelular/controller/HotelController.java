package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Hotel;
import com.transpiratininga1.controlecelular.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoteis")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<Hotel>> listarTodas() {
        return ResponseEntity.ok(hotelService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> buscarPorId(@PathVariable Long id) {
        return hotelService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ NOVO
    @GetMapping("/pendentes")
    public ResponseEntity<List<Hotel>> listarPendentes() {
        return ResponseEntity.ok(hotelService.listarPendentes());
    }

    @GetMapping("/colaborador/{registro}")
    public ResponseEntity<List<Hotel>> buscarPorColaborador(@PathVariable String registro) {
        return ResponseEntity.ok(hotelService.buscarPorColaborador(registro));
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Hotel hotel) {
        try {
            Hotel novo = hotelService.cadastrar(hotel);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Hotel hotel) {
        try {
            Hotel atualizado = hotelService.atualizar(id, hotel);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NOVO
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        try {
            Hotel aprovado = hotelService.aprovar(id);
            return ResponseEntity.ok(aprovado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NOVO
    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String observacao = body.getOrDefault("observacao", "");
            Hotel rejeitado = hotelService.rejeitar(id, observacao);
            return ResponseEntity.ok(rejeitado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            hotelService.deletar(id);
            return ResponseEntity.ok("Reserva deletada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}