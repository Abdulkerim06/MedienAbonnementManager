package at.htlleonding.tran.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "movie_history")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserMovieDB user;

    @Column(nullable = false)
    private Long tmdbMovieId;

    @Column(nullable = false)
    private LocalDateTime watchedAt;

    protected History() {
        // Required by JPA
    }

    public History(UserMovieDB user, Long tmdbMovieId) {
        this.user = user;
        this.tmdbMovieId = tmdbMovieId;
        this.watchedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserMovieDB getUser() {
        return user;
    }

    public void setUser(UserMovieDB user) {
        this.user = user;
    }

    public Long getTmdbMovieId() {
        return tmdbMovieId;
    }

    public void setTmdbMovieId(Long tmdbMovieId) {
        this.tmdbMovieId = tmdbMovieId;
    }

    public LocalDateTime getWatchedAt() {
        return watchedAt;
    }

    public void setWatchedAt(LocalDateTime watchedAt) {
        this.watchedAt = watchedAt;
    }
}
