package at.htlleonding.tran.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Embeddable;
import jakarta.persistence.*;

@Entity
public class CountryPriority {

    @Id
    @GeneratedValue
    private Long id;

    private String countryCode;
    private int priority;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    @JsonIgnoreProperties
    private Provider provider;
}
