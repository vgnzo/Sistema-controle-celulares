package com.transpiratininga1.controlecelular.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ CORRIGIDO: chave fixa via variável de ambiente (não regenera a cada restart)
    // No Render, adicione a env var: JWT_SECRET=sua_chave_secreta_longa_aqui_minimo_32_chars
    @Value("${jwt.secret:minha-chave-secreta-padrao-super-longa-aqui-2024}")
    private String secretString;

    private final long EXPIRATION_TIME = 86400000; // 24 horas

    private Key getSecretKey() {
        byte[] keyBytes = Base64.getEncoder().encode(secretString.getBytes());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Gera token com username e tipo
    public String generateToken(String username, String tipo) {
        return Jwts.builder()
                .setSubject(username)
                .claim("tipo", tipo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSecretKey())
                .compact();
    }

    // Extrair username do token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractTipo(String token) {
        return (String) extractAllClaims(token).get("tipo");
    }

    // Validar token
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}