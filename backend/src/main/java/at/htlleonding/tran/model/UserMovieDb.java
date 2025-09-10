package at.htlleonding.tran.model;

import jakarta.persistence.*;

import java.util.*;

//@NamedQueries(
//        @NamedQuery(name = "findAll", query = "select *  users from UserMovieDb users")
//)

@Entity
public class UserMovieDb {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String name;
    private String email;
    private String password;

    @ElementCollection
    @CollectionTable(name = "user_providers", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "provider_name")
    private Set<String> providers = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getProviders() {
        return providers;
    }

    public void setProviders(Set<String> providers) {
        this.providers = providers;
    }
}
