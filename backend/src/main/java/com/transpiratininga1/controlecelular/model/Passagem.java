package com.transpiratininga1.controlecelular.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.math.BigDecimal;


@Entity
@Table(name = "passagem")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class Passagem {

  public enum Status {
    PENDENTE, APROVADO, REJEITADO
  }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    //qual colaborador vai viajar
    //qual colaborador vai viajar (opcional - admin pode vincular)
    @ManyToOne
    @JoinColumn(name = "registro")
    private Colaborador colaborador;

    // nome e registro digitados pelo solicitante (texto livre)
    @Column(name = "solicitante_nome", length = 150)
    private String solicitanteNome;

    @Column(name = "solicitante_registro", length = 50)
    private String solicitanteRegistro;

    
    @NotBlank(message = "Destino obrigatório")
    @Column(name = "Destino", nullable = false, length = 100)
    private String destino;



    @Column(name = "local_embarque", length = 100)
    private String localEmbarque;

    @Column(name = "local_embarque_volta", length = 100)
    private String localEmbarqueVolta;
    
@Column(name = "data_ida")
    private LocalDate dataIda;


        
      @Column(name = "data_volta")
    private LocalDate dataVolta;

    @Column(name = "Motivo", length = 255)
    private String motivo;


    @Column(name = "valor", precision =10, scale= 2)
    private BigDecimal valor;


    // novo campo — nasce sempre como PENDENTE
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDENTE;

    // observação do admin ao rejeitar
    @Column(name = "observacao", length = 255)
    private String observacao;
}
