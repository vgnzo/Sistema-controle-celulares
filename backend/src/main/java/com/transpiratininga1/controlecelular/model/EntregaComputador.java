package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "entrega_computador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntregaComputador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // gerado automático pelo banco (1, 2, 3...)

    // qual computador foi entregue (relação com a entity Computador)
    @ManyToOne
    @JoinColumn(name = "numero_patrimonio", nullable = false)
    private Computador computador;

    // pra quem foi entregue (relação com Colaborador)
    @ManyToOne
    @JoinColumn(name = "registro", nullable = false)
    private Colaborador colaborador;

    @NotNull(message = "Data de entrega é obrigatória")
    @Column(name = "data_entrega", nullable = false)
    private LocalDate dataEntrega;

    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "ativo|devolvido|atrasado", message = "Status deve ser: ativo, devolvido ou atrasado")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "departamento", length = 100)
    private String departamento;

    @Column(name = "acessorios", length = 255)
    private String acessorios;

    @Column(nullable = false)
    private Boolean ativo = true;
}