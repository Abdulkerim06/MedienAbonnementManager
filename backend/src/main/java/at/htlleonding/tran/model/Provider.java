package at.htlleonding.tran.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long Id;
    @Column(name = "provider_name")
    private String providerName;
    @Column(name = "logo_path")
    private String LogoPath;
    @OneToMany(mappedBy = "provider")
    @JsonIgnoreProperties
    private List<CountryPriority> countryPriorityList;

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getLogoPath() {
        return LogoPath;
    }

    public void setLogoPath(String logoPath) {
        LogoPath = logoPath;
    }

    public List<CountryPriority> getCountryPriorityList() {
        return countryPriorityList;
    }

    public void setCountryPriorityList(List<CountryPriority> countryPriorityList) {
        this.countryPriorityList = countryPriorityList;
    }
}
