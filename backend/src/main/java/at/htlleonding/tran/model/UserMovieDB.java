package at.htlleonding.tran.model;

import jakarta.persistence.*;

import java.util.*;

//@NamedQueries(
//        @NamedQuery(name = "findAll", query = "select *  users from UserMovieDb users")
//)

@Entity
@Table(name = "user_movie_db")
public class UserMovieDB {

    @Id
    private UUID id; // Keycloak sub

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserProviderSubscription> subscriptions = new HashSet<>();

    public UserMovieDB(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Set<UserProviderSubscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(Set<UserProviderSubscription> subscriptions) {
        this.subscriptions = subscriptions;
    }
}
