package com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VinculoChipId implements Serializable {

    @Column(name = "iccid")
    private String iccid;

    @Column(name = "imei")
    private String imei;
}