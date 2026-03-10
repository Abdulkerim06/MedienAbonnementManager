package at.htlleonding.tran.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "tmdb_provider_id", nullable = false, unique = true)
    private Long tmdbProviderId;

    @Column(name = "provider_name")
    private String providerName;

    @Column(name = "logo_path")
    private String logoPath;

    @OneToMany(mappedBy = "provider")
    @JsonIgnoreProperties
    private List<CountryPriority> countryPriorityList;

    @OneToMany(mappedBy = "provider")
    private Set<UserProviderSubscription> subscriptions;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTmdbProviderId() {
        return tmdbProviderId;
    }

    public void setTmdbProviderId(Long tmdbProviderId) {
        this.tmdbProviderId = tmdbProviderId;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public List<CountryPriority> getCountryPriorityList() {
        return countryPriorityList;
    }

    public void setCountryPriorityList(List<CountryPriority> countryPriorityList) {
        this.countryPriorityList = countryPriorityList;
    }
}
