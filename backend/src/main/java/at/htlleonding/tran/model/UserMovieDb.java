package at.htlleonding.tran.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
public class UserMovieDb {
    @Id
    private Long id;
    private String name;
    private String email;
    private String password;

    @ElementCollection
    private List<String> providers = new ArrayList<>();


}
