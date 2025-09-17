package at.htlleonding.tran.repository;

import at.htlleonding.tran.model.UserMovieDb;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class UserMovieDBRepository {

    @Inject
    EntityManager em;

    @Transactional
    public void save(UserMovieDb user) {
        if (user.getId() != null) {
            throw new IllegalArgumentException(String.format("User with this Id Already exists", user.getId()));
        }
        this.em.persist(user);
    }

    @Transactional
    public void updateProviders(Long userId, List<String> toAdd, List<String> toRemove) {
        UserMovieDb user = em.find(UserMovieDb.class, userId);
        if (user == null) {
            throw new EntityNotFoundException("User with id " + userId + " not found");
        }

        user.getProviders().addAll(toAdd);
        user.getProviders().removeAll(toRemove);
    }



    public UserMovieDb findById(String id) {
        return this.em.find(UserMovieDb.class, id);
    }

    public Set<UserMovieDb> findAll() {
        List<UserMovieDb> resultList = this.em.createQuery("select users from UserMovieDb users", UserMovieDb.class)
                .getResultList();
        return new HashSet<>(resultList);
    }

    public Set<String> findProvidersByUser(Long userId) {
        UserMovieDb user = em.find(UserMovieDb.class, userId);
        if (user == null) {
            throw new IllegalArgumentException("User with id " + userId + " not found");
        }
        return user.getProviders();
    }

//
//    public List<UserMovieDb> findByUserName(String userName) {
//        return this.em.createQuery("select users from UserMovieDb users where ")
//    }


}
