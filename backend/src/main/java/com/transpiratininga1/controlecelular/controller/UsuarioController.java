package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.Usuario;
import com.transpiratininga1.controlecelular.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String senha = body.get("senha");

            if (username == null || senha == null) {
                return ResponseEntity.badRequest().body("username e senha são obrigatórios");
            }

            Usuario novoUsuario = usuarioService.cadastrar(username, senha);
            novoUsuario.setSenha(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/promover")
    public ResponseEntity<?> promover(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.promoverParaAdmin(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/rebaixar")
    public ResponseEntity<?> rebaixar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.rebaixarParaUser(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}