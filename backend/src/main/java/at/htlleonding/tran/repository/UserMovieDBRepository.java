package at.htlleonding.tran.repository;

import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.model.UserMovieDB;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Set;

@ApplicationScoped
public class UserMovieDBRepository implements PanacheRepository {

    @Inject
    EntityManager em;

    @Transactional
    public void save(UserMovieDB userMovieDB) {
        if (userMovieDB.getId() != null) {
            throw new IllegalArgumentException(String.format("User with this Id Already exists", userMovieDB.getId()));
        }
        this.em.persist(userMovieDB);
    }

    @Transactional
    public void updateProviders(Long userId, List<Provider> toAdd, List<Provider> toRemove) {
        UserMovieDB userMovieDB = em.find(UserMovieDB.class, userId);
        if (userMovieDB == null) {
            throw new EntityNotFoundException("User with id " + userId + " not found");
        }

        userMovieDB.getProviders().addAll(toAdd);
        userMovieDB.getProviders().removeAll(toRemove);
    }



    public UserMovieDB findById(String id) {
        return this.em.find(UserMovieDB.class, id);
    }


    public Set<Provider> findProvidersByUser(Long userId) {
        UserMovieDB userMovieDB = em.find(UserMovieDB.class, userId);
        if (userMovieDB == null) {
            throw new IllegalArgumentException("User with id " + userId + " not found");
        }
        return userMovieDB.getProviders();
    }


//    public List<UserMovieDB> findByUserName(String userName) {
//        return this.em.createQuery("select users from UserMovieDB users where UserMovieDB.name == {userName}");
//    }


}
