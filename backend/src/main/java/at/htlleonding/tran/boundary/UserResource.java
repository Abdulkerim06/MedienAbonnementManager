package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.SubscriptionUpdateDTO;
import at.htlleonding.tran.model.UserMovieDB;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserMovieDBRepository userRepo;

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed("user")
    @Produces(MediaType.TEXT_PLAIN)
    @Path("test")
    public String hello() {
        return "Hallo " + jwt.getName() + ", dein Token ist gültig!";
    }

    @PermitAll
    @GET
    public Response getMovieUsers() {
        return Response.ok(userRepo.findAll()).build();
    }

    @PermitAll
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser(UUID uuid) {
        UserMovieDB user = (UserMovieDB) userRepo.findById(uuid);
        try {
            if (user == null) {
                user = new UserMovieDB(uuid);
                this.userRepo.save(user);
            }
        } catch (Exception ex) {
            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity(String.format("{\"message\": \"%s\"}", ex.getMessage()))
                            .build()
            );
        }
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    @PUT
    @Path("/{userId}/providers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProvider(
            @PathParam("userId") UUID userId,
            List<SubscriptionUpdateDTO> updates
    ) {
        try {
            userRepo.updateSubscriptions(userId, updates);
            UserMovieDB user = userRepo.findById(userId.toString());
            return Response.ok(user).build();
        } catch (Exception ex) {
            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity(String.format("{\"message\": \"%s\"}", ex.getMessage()))
                            .build()
            );
        }
    }
}