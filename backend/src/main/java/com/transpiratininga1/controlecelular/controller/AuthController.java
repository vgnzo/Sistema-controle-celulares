package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.dto.LoginRequest;
import com.transpiratininga1.controlecelular.dto.LoginResponse;
import com.transpiratininga1.controlecelular.model.RefreshToken;
import com.transpiratininga1.controlecelular.service.RefreshTokenService;
import com.transpiratininga1.controlecelular.service.UsuarioService;
import com.transpiratininga1.controlecelular.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("=== LOGIN REQUEST ===");
        System.out.println("Username: " + loginRequest.getUsername());

        return usuarioService.validarLogin(loginRequest.getUsername(), loginRequest.getPassword())
                .map(usuario -> {
                    String accessToken = jwtUtil.generateToken(usuario.getUsername(), usuario.getTipo());
                    RefreshToken refreshToken = refreshTokenService.createRefreshToken(usuario.getUsername());

                    return ResponseEntity.<Object>ok(Map.of(
                            "accessToken", accessToken,
                            "refreshToken", refreshToken.getToken(),
                            "username", usuario.getUsername(),
                            "tipo", usuario.getTipo()
                    ));
                })
                .orElse(ResponseEntity.status(401).body("Usuário ou senha inválidos"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshTokenStr = body.get("refreshToken");

        return refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshToken -> {
                    if (refreshTokenService.isExpired(refreshToken)) {
                        refreshTokenService.deleteByUsername(refreshToken.getUsername());
                        return ResponseEntity.status(401).<Object>body("Refresh token expirado. Faça login novamente.");
                    }

                    String username = refreshToken.getUsername();
                    String tipo = usuarioService.buscarPorUsername(username)
                            .map(u -> u.getTipo())
                            .orElse("USER");

                    String newAccessToken = jwtUtil.generateToken(username, tipo);

                    return ResponseEntity.<Object>ok(Map.of(
                            "accessToken", newAccessToken,
                            "username", username,
                            "tipo", tipo
                    ));
                })
                .orElse(ResponseEntity.status(401).body("Refresh token inválido."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        refreshTokenService.deleteByUsername(username);
        return ResponseEntity.ok("Logout realizado com sucesso.");
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