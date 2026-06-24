package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "hotel")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    public enum Status {
        PENDENTE, APROVADO, REJEITADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // qual colaborador vai se hospedar
    @ManyToOne
    @JoinColumn(name = "registro", nullable = false)
    private Colaborador colaborador;

   @Column(name = "data_entrada")
    private LocalDate dataEntrada;

    @Column(name = "data_saida")
    private LocalDate dataSaida;

    @Column(name = "motivo", length = 255)
    private String motivo;

    @Column(name = "valor", precision = 10, scale = 2)
    private BigDecimal valor;


     @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDENTE;

    // observação do admin ao rejeitar
    @Column(name = "observacao", length = 255)
    private String observacao;
}