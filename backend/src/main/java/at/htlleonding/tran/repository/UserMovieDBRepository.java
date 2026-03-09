package at.htlleonding.tran.repository;

import at.htlleonding.tran.dto.ProviderWithOwnership;
import at.htlleonding.tran.dto.SubscriptionUpdateDTO;
import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.model.UserMovieDB;
import at.htlleonding.tran.model.UserProviderSubscription;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserMovieDBRepository implements PanacheRepository<UserMovieDB> {

    @Inject
    EntityManager em;

    @Inject
    ProviderRepository providerRepo;

    @Transactional
    public void updateSubscriptions(UUID userId, List<SubscriptionUpdateDTO> updates) {

        UserMovieDB user = em.find(UserMovieDB.class, userId);
        if (user == null) {
            throw new EntityNotFoundException("User not found: " + userId);
        }

        Map<Long, UserProviderSubscription> existing =
                user.getSubscriptions().stream()
                        .collect(Collectors.toMap(
                                s -> s.getProvider().getTmdbProviderId(),
                                Function.identity()
                        ));

        for (SubscriptionUpdateDTO dto : updates) {
            Long tmdbProviderId = dto.providerId();

            UserProviderSubscription sub = existing.remove(tmdbProviderId);

            if (sub == null) {
                Provider provider = providerRepo.findByTmdbProviderId(tmdbProviderId);
                if (provider == null) {
                    throw new EntityNotFoundException(
                            "Provider not in DB (tmdbProviderId=" + tmdbProviderId + "). Sync providers first."
                    );
                }

                sub = new UserProviderSubscription();
                sub.setUser(user);
                sub.setProvider(provider);
                sub.setBillingCycle(dto.billingCycle());
                sub.setLastBillingDate(dto.lastBillingDate());

                user.getSubscriptions().add(sub);
            } else {
                sub.setBillingCycle(dto.billingCycle());
                sub.setLastBillingDate(dto.lastBillingDate());
            }
        }

        existing.values().forEach(user.getSubscriptions()::remove);
    }

    /**
     * Sucht einen User anhand seiner UUID.
     * Gibt Optional zurück, falls User nicht existiert.
     */
    public java.util.Optional<UserMovieDB> findByUUID(UUID userId) {
        UserMovieDB user = em.find(UserMovieDB.class, userId);
        return java.util.Optional.ofNullable(user);
    }

    /**
     * Gibt ALLE Provider mit Flag zurück, ob der User sie besitzt.
     * Ideal für Frontend: Ein Request, Filter im Frontend.
     */
    public List<ProviderWithOwnership> getProvidersWithOwnership(UUID userId) {
        return em.createQuery("""
            SELECT new at.htlleonding.tran.dto.ProviderWithOwnership(
                p.id,
                p.tmdbProviderId,
                p.providerName,
                p.logoPath,
                CASE WHEN s.id IS NOT NULL THEN true ELSE false END
            )
            FROM Provider p
            LEFT JOIN UserProviderSubscription s
                ON s.provider.id = p.id AND s.user.id = :userId
            ORDER BY p.providerName
        """, ProviderWithOwnership.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    /**
     * Gibt die TMDB Provider IDs zurück, die der User abonniert hat.
     * Wird für Movie-Provider-Filterung verwendet.
     */
    public Set<Long> getUserProviderTmdbIds(UUID userId) {
        return em.createQuery("""
            SELECT p.tmdbProviderId
            FROM UserProviderSubscription s
            JOIN s.provider p
            WHERE s.user.id = :userId
        """, Long.class)
                .setParameter("userId", userId)
                .getResultStream()
                .collect(Collectors.toSet());
    }
}
