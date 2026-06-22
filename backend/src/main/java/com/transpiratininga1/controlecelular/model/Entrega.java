package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Entrega")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entrega {

    @EmbeddedId
    private EntregaId id;

    @ManyToOne
    @MapsId("imei")
    @JoinColumn(name = "imei")
    private Celular celular;

    @ManyToOne
    @MapsId("registro")
    @JoinColumn(name = "registro")
    private Colaborador colaborador;

    @NotNull(message = "Data de entrega é obrigatória")
    @Column(name = "data_entrega", nullable = false)
    private LocalDate dataEntrega;

    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "ativo|devolvido|atrasado", message = "Status deve ser: ativo, devolvido ou atrasado")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "acessorios", length = 255)
    private String acessorios;

    @Column(name = "departamento", length = 100)
    private String departamento;
}