package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private Instant expiryDate;

    public RefreshToken() {}

    public RefreshToken(String token, String username, Instant expiryDate) {
        this.token = token;
        this.username = username;
        this.expiryDate = expiryDate;
    }

    public Long getId() { return id; }
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public Instant getExpiryDate() { return expiryDate; }

    public void setToken(String token) { this.token = token; }
    public void setUsername(String username) { this.username = username; }
    public void setExpiryDate(Instant expiryDate) { this.expiryDate = expiryDate; }
}