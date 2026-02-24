package com.transpiratininga1.controlecelular.repository;

//to improtando a entidade q criei antes celular, 
// jpareposirtory  é a interface do srping q faz toda magica
// list serve pra retorna listas

import com.transpiratininga1.controlecelular.model.Celular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


//cria a interface 

//eu so vou declara os metodos, o spring ja vai implementalos automaticamnete
@Repository
public interface CelularRepository extends JpaRepository<Celular, String> {

    //busca celulares
    //o spring le o nome do metodo findBystatus, o spirng gera o sql 
    //findBy busca, status é o campo da entidade celular

    List<Celular> findByStatus(String status);
     
    

    //busca o celulares por modelo
    List<Celular> findByModeloContainingIgnoreCase(String modelo);

    //ignore case --> ignora leras maiculas e minusculas
    //modelo é o campo da entidade


    //verifica se existe celular com IMEI
    //existsBy verifica se existe
    boolean existsByImei(String imei);


}
