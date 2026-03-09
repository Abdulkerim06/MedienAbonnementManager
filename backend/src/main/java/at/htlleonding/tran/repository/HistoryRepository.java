package at.htlleonding.tran.repository;

import at.htlleonding.tran.model.History;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class HistoryRepository implements PanacheRepository<History> {

    @Inject
    EntityManager em;

    /**
     * Gibt die History eines Users zurück, sortiert nach neuestem Eintrag.
     */
    public List<History> findByUserId(UUID userId) {
        return em.createQuery("""
            SELECT h
            FROM History h
            WHERE h.user.id = :userId
            ORDER BY h.watchedAt DESC
        """, History.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    /**
     * Gibt die letzten N History-Einträge eines Users zurück.
     */
    public List<History> findByUserIdLimit(UUID userId, int limit) {
        return em.createQuery("""
            SELECT h
            FROM History h
            WHERE h.user.id = :userId
            ORDER BY h.watchedAt DESC
        """, History.class)
                .setParameter("userId", userId)
                .setMaxResults(limit)
                .getResultList();
    }

    /**
     * Prüft ob ein User einen bestimmten Film in der History hat.
     */
    public boolean hasWatchedMovie(UUID userId, Long tmdbMovieId) {
        Long count = em.createQuery("""
            SELECT COUNT(h)
            FROM History h
            WHERE h.user.id = :userId AND h.tmdbMovieId = :movieId
        """, Long.class)
                .setParameter("userId", userId)
                .setParameter("movieId", tmdbMovieId)
                .getSingleResult();
        return count > 0;
    }
}
