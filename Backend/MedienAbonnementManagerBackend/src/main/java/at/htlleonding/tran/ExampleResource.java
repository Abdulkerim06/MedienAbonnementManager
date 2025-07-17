package at.htlleonding.tran;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ExampleResource {


    @GET
    public List<User> getAll() {
        return User.listAll();
    }

    @POST
    @Transactional
    public void addUser(User user) {
        user.persist();
    }
}
