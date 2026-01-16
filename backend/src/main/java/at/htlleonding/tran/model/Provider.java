package at.htlleonding.tran.model;

import jakarta.persistence.*;

@Entity
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long Id;
    String name;

    @Column(name = "logo_path")
    String LogoPath;

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoPath() {
        return LogoPath;
    }

    public void setLogoPath(String logoPath) {
        LogoPath = logoPath;
    }
}
