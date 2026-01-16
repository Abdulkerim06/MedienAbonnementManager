package at.htlleonding.tran.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;
    Long keycloakuserId;
    Long movieId;
    LocalDate createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getKeycloakuserId() {
        return keycloakuserId;
    }

    public void setKeycloakuserId(Long keycloakuserId) {
        this.keycloakuserId = keycloakuserId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
