package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.RefreshToken;
import com.transpiratininga1.controlecelular.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    // 7 dias em milissegundos
    private static final long REFRESH_EXPIRATION_MS = 7L * 24 * 60 * 60 * 1000;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken createRefreshToken(String username) {
        // Remove token antigo do usuário (só um por vez)
        refreshTokenRepository.deleteByUsername(username);

        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID().toString(),
                username,
                Instant.now().plusMillis(REFRESH_EXPIRATION_MS)
        );

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    @Transactional
    public void deleteByUsername(String username) {
        refreshTokenRepository.deleteByUsername(username);
    }
}