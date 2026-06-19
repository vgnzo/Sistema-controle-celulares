package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "VinculoChip")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VinculoChip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "iccid", nullable = false)
    private Chip chip;

    @ManyToOne
    @JoinColumn(name = "imei", nullable = false)
    private Celular celular;

    @NotNull(message = "Data de inicio é obrigatória")
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;   

    @Column(name = "data_fim")
    private LocalDate dataFim; //null = ainda esta vinculado

}