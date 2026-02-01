package at.htlleonding.tran.repository;

import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.model.UserMovieDB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ProviderRepository {

    @Inject
    EntityManager em;

    @Transactional
    public void save(Provider provider) {
        if (provider.getId() != null) {
            throw new IllegalArgumentException(String.format("Provider with this Id Already exists", provider.getId()));
        }
        this.em.persist(provider);
    }

    public Provider findByTmdbProviderId(Long tmdbProviderId) {
        return em.createQuery(
                        "select p from Provider p where p.tmdbProviderId = :tmdbId",
                        Provider.class
                )
                .setParameter("tmdbId", tmdbProviderId)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    @Transactional
    public Provider upsertFromTmdb(Long tmdbProviderId, String name, String logoPath) {
        Provider existing = findByTmdbProviderId(tmdbProviderId);
        if (existing != null) {
            existing.setProviderName(name);
            existing.setLogoPath(logoPath);
            return existing;
        }

        Provider created = new Provider();
        created.setTmdbProviderId(tmdbProviderId);
        created.setProviderName(name);
        created.setLogoPath(logoPath);
        em.persist(created);
        return created;
    }

    public List<Provider> toAddProvider(List<Provider> toAdd, Long id) {
        List<Provider> resultList = this.em.createQuery("select p from Provider p ", Provider.class)
                .getResultList();

        return resultList;
    }

    public List<Provider> toRemoveProvider(List<Provider> toRemove, Long id) {
        List<Provider> resultList = this.em.createQuery("select p from Provider p", Provider.class)
                .getResultList();
        return resultList;
    }

    public List<Provider> findAll() {
        List<Provider> resultList = this.em.createQuery("select p from Provider p", Provider.class)
                .getResultList();
        return resultList;
    }
}
