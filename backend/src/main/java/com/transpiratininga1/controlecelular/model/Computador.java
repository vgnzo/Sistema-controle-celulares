package com.transpiratininga1.controlecelular.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "Computador")
@Data //gera os get, set, tostring, equal, hashcode automaticamente
@NoArgsConstructor //gera contrutor vazio
@AllArgsConstructor //gera contrutor com todos os campos

public class Computador {

    @Id
    @Column(name ="numero_patrimonio", length = 30)
    @NotBlank(message = "Numero de patrimonio obrigatório")
    private String numeroPatrimonio; //chave primária

    @Column(name = "numero_serie", length = 30)
    private String numeroSerie;
    

    @Column(name = "marca", length = 50)
    private String marca;

    @Column(name = "modelo", length = 50)
    @NotBlank(message = "Modelo obrigatório")
    private String modelo;


    @Column(name = "Status", length = 20, nullable = false)
    @NotBlank(message = "Status obrigatório")
    private String status;


 @Column(name = "data_aquisicao", nullable = false)
@NotNull(message = "Data de aquisição obrigatório")
private LocalDate dataAquisicao;

    @Column(name = "vida_util")
    private Integer vidaUtil; //em meses

    @Column(name = "Fornecedor")
    private String fornecedor;

    @Column(name = "mac_address", length = 17)
    private String macAddress;

    @Column(name = "proprietario", length = 100)
    private String proprietario;

//Validação do status (roda antes de salvar ou atualizar o banco)

    @PrePersist
    @PreUpdate
    private void validarStatus(){
        if(status != null){
            status = status.toLowerCase().trim(); //converte para minúsculo e remove espaços em branco
if (!status.matches("em estoque|entregue|manutencao|devolvido|baixado")) {    
throw new IllegalArgumentException("Status inválido. Use: em estoque, entregue, manutencao, devolvido ou baixado");                
               
            }
        }
    }
}
