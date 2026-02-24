package com.transpiratininga1.controlecelular;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication //ativa o spring
public class ControleCelularApplication {
    public static void main(String[] args) {
        SpringApplication.run(ControleCelularApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("🚀 API Controle de Celulares INICIADA!");
        System.out.println("📡 Servidor rodando em: http://localhost:8080");
        System.out.println("📚 Endpoints disponíveis:");
        System.out.println("   - http://localhost:8080/api/celulares");
        System.out.println("========================================\n");
    }
}


//@SpringBootApplication ativa o spring Boot automaticamente, configura td sozinho
//springApplication.run inicia o servidor spring boot, conecta no BD e registra tds endpoints
    