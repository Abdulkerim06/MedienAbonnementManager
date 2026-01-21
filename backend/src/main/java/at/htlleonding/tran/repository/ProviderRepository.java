package at.htlleonding.tran.repository;

import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.model.UserMovieDb;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
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


}
