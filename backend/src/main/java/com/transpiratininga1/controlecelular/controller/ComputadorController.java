package com.transpiratininga1.controlecelular.controller;



import com.transpiratininga1.controlecelular.model.Computador;
import com.transpiratininga1.controlecelular.service.ComputadorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController  //é um controlador REST (API)
@RequestMapping("/api/computadores") //todas as rotas começam com /api/celulares


public class ComputadorController {

    @Autowired
    private ComputadorService computadorService;
    


    //Get api/computadores - listar todos computadores
    @GetMapping
    public ResponseEntity<List<Computador>> listarTodos(){
        List<Computador> computadores = computadorService.listarTodos();
        return ResponseEntity.ok(computadores); //retorna 200(sucesso) lista dos computadores
    
    }


    //get api/computadores/ patrimonio
    @GetMapping("/{patrimonio}")
    public ResponseEntity<?> buscarPorPatrimonio(@PathVariable String patrimonio){
        Computador computador = computadorService.buscarPorPatrimonio(patrimonio)
             .orElseThrow(() -> new RuntimeException("Computador não encontrado com patrimônio: " + patrimonio));
    return ResponseEntity.ok(computador);
}    



// Post api/computador -> cadastrar um novo computador
@PostMapping
public ResponseEntity<?> cadastrar (@Valid @RequestBody Computador computador){
    try{
        Computador novoComputador = computadorService.cadastrar(computador);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoComputador);

    }catch  (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
             }
      }



      // PUT api/computador atualizar um computador 
      @PutMapping ("/{patrimonio}")
      public ResponseEntity<?> atualizar(@PathVariable String patrimonio, @Valid @RequestBody Computador computador){
        try {
            Computador computadorAtualizado = computadorService.atualizar(patrimonio, computador);
            return ResponseEntity.ok(computadorAtualizado);
        } catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }


      }

      //delete api/computadores -> deletar um computador
      @DeleteMapping("/{patrimonio}")
      public ResponseEntity<?> deletar(@PathVariable String patrimonio){

        try{
            computadorService.deletar(patrimonio);
            return ResponseEntity.ok("Computador deletado com sucesso");
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

      }
        //buscar por status 
        //Get api/computadores/status/{status}

        @GetMapping("/status/{status}")
        public ResponseEntity<List<Computador>> buscarPorStatus(@PathVariable String status) {
            List<Computador> computadores = computadorService.buscarPorStatus(status);
            return ResponseEntity.ok(computadores);
        }
      }




    
    

