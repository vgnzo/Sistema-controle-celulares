package com.transpiratininga1.controlecelular.model;

//jakarta é o novo nome das bibliotecas java enterprise

import jakarta.persistence.*;  //anotaçoes do jpa (pra mapear a classe pro banco)
import jakarta.validation.constraints.NotBlank; //validações (campo obrigatorio, etc)
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;  //lombook gera gett e sett automaticamnete
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;  //pra trabalha com datas


@Entity //diz q essa classe representa uma tabela
@Table(name ="Celular")   //nome da tabeal no banco
@Data //gera os get, set, tostring, equal, hashcode automaticamente
@NoArgsConstructor //gera contrutor vazio
@AllArgsConstructor //gera contrutor com todos os campos


public class Celular {

    @Id   //PK
    @Column(name = "imei", length = 15) //nome da coluna e tamano max
    @NotBlank(message = "IMEI è obrigatório") //campo obrigatorio
    private String imei; //atributo da classe

    @Column(name = "modelo", length = 100, nullable = false) //nullable = false fala q n pode ser null no banco
    @NotBlank(message = "Modelo é obrigatório")
    private String modelo;

    @Column(name = "status", length = 20, nullable = false)
    @NotBlank(message = "Status é obrigatório")
    private String status = "em estoque"; //valor padrão

     @Column(name = "fornecedor", length = 100)
    private String fornecedor;


    @Column(name = "data_aquisicao", nullable = false)
    @NotNull(message = "Data de aquisição é obrigatória")
    private LocalDate dataAquisicao; 
    //é pra datas o localdate, e usamos @notnull pq é data e nao texto


    @Column(name = "vida_util")
    private Integer vidaUtil;



    //agr vem o metodo de validação
//matches verifica se os status é um dos valores permitidos
    @PrePersist //executa antes de salva o BD
    @PreUpdate //executa antes de atualiza o BD
private void validarStatus() {

    System.out.println("STATUS RECEBIDO: [" + status + "]");

    if (status != null) {
        status = status.toLowerCase().trim();

        if (!status.matches("em estoque|entregue|manutencao|devolvido")) {
            throw new IllegalArgumentException(
                "Status inválido. Use: em estoque, entregue, manutencao ou devolvido"
            );
        }
    }
}
}


