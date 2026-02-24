package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;


@Entity 
@Table (name = "Colaborador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Colaborador {

    @Id 
    @Column(name = "registro", length = 20)
    private String registro;

    @NotBlank(message = "registro")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

       @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos")
    @Column(name = "cpf", nullable = false, unique = true, length = 11)
    private String cpf;
    
    @Email(message = "Email inválido")
    @Column(name = "email", length = 100)
    private String email;
    
    
    @NotBlank(message = "Departamento é obrigatório")
    @Column(name = "departamento", nullable = false, length = 50)
    private String departamento;
    
    @NotBlank(message = "Cargo é obrigatório")
    @Column(name = "cargo", nullable = false, length = 50)
    private String cargo;

    @Column(name = "data_admissao")
    private LocalDate dataAdmissao;

    @NotBlank (message = "Status Obrigatório")
    @Pattern(regexp = "ativo|inativo", message = "Status deve ser: ativo ou inativo")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "telefone_contato", length = 20)
    private String telefoneContato;


}
