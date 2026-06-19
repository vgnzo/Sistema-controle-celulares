package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Chip")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chip {

    @Id
    @Column(name = "iccid", length = 20)
    @NotBlank(message = "Número do chip é obrigatório")
    private String iccid;

    @Column(name = "numero_linha", length = 15)
    private String numeroLinha;

    @Column(name = "operadora", length = 50)
    private String operadora;

    @Column (name = "status", length = 20, nullable = false)
    @NotBlank(message = "Status é obrigatório")
    private String status = "disponivel"; //valor padrão

    // validação do status
    @PrePersist //executa antes de salvar no BD
    @PreUpdate //executa antes de atualizar no BD
    private void validarStatus() {
        if (status != null){
            status = status.toLowerCase().trim();//converte pra minusculo pra facilitar a comparação
            
           if (!status.matches("disponivel|em uso|com problema|cancelado")) {
            throw new IllegalArgumentException(
                "Status inválido. Use: disponivel, em uso, com problema ou cancelado"                
                );
            }
        }
    }
}