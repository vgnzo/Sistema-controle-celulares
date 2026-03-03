package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.dto.LoginRequest;
import com.transpiratininga1.controlecelular.dto.LoginResponse;
import com.transpiratininga1.controlecelular.model.Usuario;
import com.transpiratininga1.controlecelular.service.UsuarioService;
import com.transpiratininga1.controlecelular.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;



@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    
    // Tenta banco primeiro
    Optional<Usuario> usuarioBanco = usuarioService.validarLogin(
        loginRequest.getUsername(), loginRequest.getPassword());
    
    if (usuarioBanco.isPresent()) {
        String token = jwtUtil.generateToken(usuarioBanco.get().getUsername(), usuarioBanco.get().getTipo());
        return ResponseEntity.ok(new LoginResponse(token, usuarioBanco.get().getUsername(), usuarioBanco.get().getTipo()));
    }

    // Fallback: usuários fixos
    String u = loginRequest.getUsername();
    String p = loginRequest.getPassword();
    
    if ((u.equals("admin") && p.equals("admin123")) ||
        (u.equals("Vini") && p.equals("vini123")) ||
        (u.equals("Ivo") && p.equals("ivo123"))) {
        String token = jwtUtil.generateToken(u, "ADMIN");
        return ResponseEntity.ok(new LoginResponse(token, u, "ADMIN"));
    }

    return ResponseEntity.status(401).body("Usuário ou senha inválidos");
}

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(jwtToken);

            if (jwtUtil.validateToken(jwtToken, username)) {
                String tipo = jwtUtil.extractTipo(jwtToken);
                return ResponseEntity.ok(new LoginResponse(jwtToken, username, tipo));
            }
            return ResponseEntity.status(401).body("Token inválido");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido");
        }
    }
}