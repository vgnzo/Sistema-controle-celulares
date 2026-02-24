package com.transpiratininga1.controlecelular.controller;


//importei o celular e celularservice q sao minhas classes
//@valid alidaçao automatica 
//responseEntity serve pra retorna respostas HTTP

import com.transpiratininga1.controlecelular.model.Celular;
import com.transpiratininga1.controlecelular.service.CelularService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController  //é um controlador REST (API)
@RequestMapping("/api/celulares") //todas as rotas começam com /api/celulares
@CrossOrigin(origins = "*") //permite acesso de qqrl origem (front)
public class CelularController {

    @Autowired
    private CelularService celularService;



    // GET /api/celulares - listar todos os celulares
    @GetMapping
    public ResponseEntity<List<Celular>> listarTodos(){
        List<Celular> celulares = celularService.listarTodos();
        return ResponseEntity.ok(celulares); //retorna status 200(sucesso) lista de celulares
    }

    //GET /api/celulares/{imei} - busca celular por IMEI

@GetMapping("/{imei}")
public ResponseEntity<?> buscarPorImei(@PathVariable String imei){
    Celular celular = celularService.buscarPorImei(imei)
        .orElseThrow(() -> new RuntimeException("Celular não encontrado com IMEI: " + imei));
    return ResponseEntity.ok(celular);
}

      //pathvariable pega o valor do imei da url, se encontra retorna 200 se n encontra retorna 404

   

    //POST /api/celulares - cadastrar novo celular explicaçao no readme
    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Celular celular){
        try{
            Celular novoCelular = celularService.cadastrar(celular);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoCelular);
             } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
             }
    }


    //PUT /api/celulares/{imei} - atualizar celular com imei
    @PutMapping("/{imei}")
    public ResponseEntity<?> atualizar(@PathVariable String imei, @Valid @RequestBody Celular celular){
        try {
            Celular celularAtualizado = celularService.atualizar(imei, celular);
            return ResponseEntity.ok(celularAtualizado);
             } catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().body(e.getMessage());             
            }
    }


    // DELETE /api/celulares/{imei} - Deletar celular do banco
    @DeleteMapping("/{imei}")
    public ResponseEntity<?> deletar(@PathVariable String imei) {
        try {
            celularService.deletar(imei);
            return ResponseEntity.ok("Celular deletado com sucesso");
           } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

           }
    }

    //GET /api/celulares/status/{status} - buscar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Celular>> buscarPorStatus(@PathVariable String status) {
        List<Celular> celulares = celularService.buscarPorStatus(status);
        return ResponseEntity.ok(celulares);
    }

     // GET /api/celulares/modelo/{modelo} - Buscar por modelo
    @GetMapping("/modelo/{modelo}")
    public ResponseEntity<List<Celular>> buscarPorModelo(@PathVariable String modelo) {
        List<Celular> celulares = celularService.buscarPorModelo(modelo);
        return ResponseEntity.ok(celulares); 
}
}