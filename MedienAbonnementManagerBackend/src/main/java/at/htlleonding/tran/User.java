package at.htlleonding.tran;



import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {
    public String username;
    public String email;
    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
