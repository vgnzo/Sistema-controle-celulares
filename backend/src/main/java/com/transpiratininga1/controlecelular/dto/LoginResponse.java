package com.transpiratininga1.controlecelular.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String tipo;

    public LoginResponse(String token, String username, String tipo) {
        this.token = token;
        this.username = username;
        this.tipo = tipo;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getTipo() { return tipo; }
}