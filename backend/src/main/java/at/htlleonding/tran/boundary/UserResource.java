package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.SubscriptionUpdateDTO;
import at.htlleonding.tran.model.UserMovieDB;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import at.htlleonding.tran.service.UserService;
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
    UserService userService;

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed("user")
    @Produces(MediaType.TEXT_PLAIN)
    @Path("test")
    public String hello() {
        return "Hallo " + jwt.getName() + ", dein Token ist gültig!";
    }

    /**
     * Gibt die Daten des aktuell authentifizierten Users zurück.
     * Erstellt automatisch einen User, falls noch nicht vorhanden.
     */
    @GET
    @Path("/me")
    @RolesAllowed("user")
    public Response getCurrentUser() {
        UserMovieDB user = userService.getCurrentUser();
        return Response.ok(user).build();
    }

    @PermitAll
    @GET
    public Response getMovieUsers() {
        return Response.ok(userRepo.findAll()).build();
    }

    /**
     * Aktualisiert die Provider-Subscriptions des aktuell authentifizierten Users.
     * User-ID kommt aus dem JWT-Token, nicht aus der URL.
     */
    @PUT
    @Path("/me/subscriptions")
    @RolesAllowed("user")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateSubscriptions(List<SubscriptionUpdateDTO> updates) {
        try {
            UserMovieDB user = userService.getCurrentUser();
            userRepo.updateSubscriptions(user.getId(), updates);
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