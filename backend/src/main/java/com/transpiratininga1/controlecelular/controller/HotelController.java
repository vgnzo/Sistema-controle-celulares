package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Hotel;
import com.transpiratininga1.controlecelular.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hoteis")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // GET - listar todas
    @GetMapping
    public ResponseEntity<List<Hotel>> listarTodas() {
        return ResponseEntity.ok(hotelService.listarTodas());
    }

    // GET - buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> buscarPorId(@PathVariable Long id) {
        return hotelService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET - buscar por colaborador
    @GetMapping("/colaborador/{registro}")
    public ResponseEntity<List<Hotel>> buscarPorColaborador(@PathVariable String registro) {
        return ResponseEntity.ok(hotelService.buscarPorColaborador(registro));
    }

    // POST - cadastrar
    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Hotel hotel) {
        try {
            Hotel novo = hotelService.cadastrar(hotel);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - atualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Hotel hotel) {
        try {
            Hotel atualizado = hotelService.atualizar(id, hotel);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - deletar
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