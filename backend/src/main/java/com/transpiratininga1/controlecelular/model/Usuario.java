package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(nullable = false, length = 10)
    private String tipo = "USER";
}