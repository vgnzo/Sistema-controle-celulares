package  com.transpiratininga1.controlecelular.model;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntregaId implements Serializable{

    @Column( name = "imei")
    private String imei;

    @Column( name = "registro")
        private String registro;
    
}