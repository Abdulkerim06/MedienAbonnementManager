package at.htlleonding.tran.repository;

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
public class UserMovieDBRepository implements PanacheRepository {

    @Inject
    EntityManager em;

    @Inject
    ProviderRepository providerRepo;

    @Transactional
    public void save(UserMovieDB userMovieDB) {
        if (userMovieDB.getId() != null) {
            throw new IllegalArgumentException(String.format("User with this Id Already exists", userMovieDB.getId()));
        }
        this.em.persist(userMovieDB);
    }

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

    public UserMovieDB findById(String id) {
        return this.em.find(UserMovieDB.class, id);
    }


    public Set<UserProviderSubscription> findProviderSupscriptionByUser(UUID userId) {
        UserMovieDB user = em.find(UserMovieDB.class, userId);
        if (user == null) {
            throw new EntityNotFoundException("User not found: " + userId);
        }
        return user.getSubscriptions();
    }

    public Set<Provider> findProvidersByUser(UUID userId) {
        return em.createQuery("""
        select s.provider
        from UserProviderSubscription s
        where s.user.id = :userId
    """, Provider.class)
                .setParameter("userId", userId)
                .getResultStream()
                .collect(Collectors.toSet());
    }

    public Set<Long> findProviderIdsByUser(UUID userId) {
        return em.createQuery("""
        select s.provider.id
        from UserProviderSubscription s
        where s.user.id = :userId
        """, Long.class)
                .setParameter("userId", userId)
                .getResultStream()
                .collect(Collectors.toSet());
    }
}
