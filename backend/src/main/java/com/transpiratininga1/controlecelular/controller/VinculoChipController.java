package com.transpiratininga1.controlecelular.controller;

import com.transpiratininga1.controlecelular.model.VinculoChip;
import com.transpiratininga1.controlecelular.service.VinculoChipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vinculos-chip")
@CrossOrigin(origins = "*")
public class VinculoChipController {

    @Autowired
    private VinculoChipService vinculoChipService;

    // GET /api/vinculos-chip/celular/{imei} - histórico completo de chips de um celular
    @GetMapping("/celular/{imei}")
    public ResponseEntity<List<VinculoChip>> historicoPorCelular(@PathVariable String imei) {
        return ResponseEntity.ok(vinculoChipService.historicoPorCelular(imei));
    }

    // GET /api/vinculos-chip/chip/{iccid} - histórico completo de celulares de um chip
    @GetMapping("/chip/{iccid}")
    public ResponseEntity<List<VinculoChip>> historicoPorChip(@PathVariable String iccid) {
        return ResponseEntity.ok(vinculoChipService.historicoPorChip(iccid));
    }

    // GET /api/vinculos-chip/celular/{imei}/atual - chip atual de um celular
    @GetMapping("/celular/{imei}/atual")
    public ResponseEntity<?> chipAtualDoCelular(@PathVariable String imei) {
        return vinculoChipService.chipAtualDoCelular(imei)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.ok("Esse celular não tem chip vinculado no momento"));
    }

    // POST /api/vinculos-chip - vincular chip a um celular
    // Body esperado: { "iccid": "...", "imei": "..." }
    @PostMapping
    public ResponseEntity<?> vincular(@RequestBody Map<String, String> body) {
        try {
            String iccid = body.get("iccid");
            String imei = body.get("imei");
            VinculoChip vinculo = vinculoChipService.vincular(iccid, imei);
            return ResponseEntity.ok(vinculo);
        } catch  (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/vinculos-chip/celular/{imei} - desvincular chip do celular
    @DeleteMapping("/celular/{imei}")
    public ResponseEntity<?> desvincular(@PathVariable String imei) {
        try {
            vinculoChipService.desvincular(imei);
            return ResponseEntity.ok("Chip desvinculado com sucesso");
        } catch  (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}