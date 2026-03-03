package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Usuario;
import com.transpiratininga1.controlecelular.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET - listar todos (só admin)
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // POST - cadastrar novo usuário (público)
    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            Usuario novoUsuario = usuarioService.cadastrar(usuario);
            // não retorna a senha
            novoUsuario.setSenha(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - promover para ADMIN
    @PutMapping("/{id}/promover")
    public ResponseEntity<?> promover(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.promoverParaAdmin(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT - rebaixar para USER
    @PutMapping("/{id}/rebaixar")
    public ResponseEntity<?> rebaixar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.rebaixarParaUser(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - deletar usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}