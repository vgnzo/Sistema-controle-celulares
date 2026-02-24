package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.dto.LoginRequest;
import com.transpiratininga1.controlecelular.dto.LoginResponse;
import com.transpiratininga1.controlecelular.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Usuário e senha fixos (hardcoded)
        String USERNAME = "admin";
        String PASSWORD = "admin123";

        // Validar credenciais
       // Múltiplos usuários
if ((loginRequest.getUsername().equals("admin") && loginRequest.getPassword().equals("admin123")) ||
    (loginRequest.getUsername().equals("Vini") && loginRequest.getPassword().equals("vini123")) ||
    (loginRequest.getUsername().equals("Ivo") && loginRequest.getPassword().equals("ivo123"))) {
            
            // Gerar token
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            
            // Retornar resposta com token
            LoginResponse response = new LoginResponse(token, loginRequest.getUsername(), "admin");
            return ResponseEntity.ok(response);
        }

        // Credenciais inválidas
        return ResponseEntity.status(401).body("Usuário ou senha inválidos");
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " do início
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(jwtToken);
            
            if (jwtUtil.validateToken(jwtToken, username)) {
                return ResponseEntity.ok("Token válido");
            }
            return ResponseEntity.status(401).body("Token inválido");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido");
        }
    }
}