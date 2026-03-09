package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.AddHistoryDTO;
import at.htlleonding.tran.dto.HistoryDTO;
import at.htlleonding.tran.dto.ProviderWithOwnership;
import at.htlleonding.tran.dto.SubscriptionUpdateDTO;
import at.htlleonding.tran.model.History;
import at.htlleonding.tran.model.UserMovieDB;
import at.htlleonding.tran.repository.HistoryRepository;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import at.htlleonding.tran.service.UserService;
import jakarta.transaction.Transactional;
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
    HistoryRepository historyRepo;

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
     * Gibt alle Provider mit Flag zurück, ob der User sie besitzt.
     * Frontend kann dann filtern (alle anzeigen oder nur owned).
     */
    @GET
    @Path("/me/providers")
    @RolesAllowed("user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProvidersWithOwnership() {
        UserMovieDB user = userService.getCurrentUser();
        List<ProviderWithOwnership> providers = userRepo.getProvidersWithOwnership(user.getId());
        return Response.ok(providers).build();
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

    /**
     * Fügt einen Film zur Watch-History des Users hinzu.
     */
    @POST
    @Path("/me/history")
    @RolesAllowed("user")
    @Transactional
    public Response addToHistory(AddHistoryDTO dto) {
        UserMovieDB user = userService.getCurrentUser();
        History history = new History(user, dto.tmdbMovieId());
        historyRepo.persist(history);
        return Response.status(Response.Status.CREATED)
                .entity(HistoryDTO.from(history))
                .build();
    }

    /**
     * Gibt die Watch-History des Users zurück (neueste zuerst).
     * Optional: limit-Parameter für Paginierung.
     */
    @GET
    @Path("/me/history")
    @RolesAllowed("user")
    public Response getHistory(@QueryParam("limit") Integer limit) {
        UserMovieDB user = userService.getCurrentUser();
        List<History> history;

        if (limit != null && limit > 0) {
            history = historyRepo.findByUserIdLimit(user.getId(), limit);
        } else {
            history = historyRepo.findByUserId(user.getId());
        }

        List<HistoryDTO> dtos = history.stream()
                .map(HistoryDTO::from)
                .toList();

        return Response.ok(dtos).build();
    }

    /**
     * Entfernt einen Eintrag aus der Watch-History.
     */
    @DELETE
    @Path("/me/history/{id}")
    @RolesAllowed("user")
    @Transactional
    public Response deleteFromHistory(@PathParam("id") Long historyId) {
        UserMovieDB user = userService.getCurrentUser();

        History history = historyRepo.findById(historyId);
        if (history == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"message\": \"History entry not found\"}")
                    .build();
        }

        // Sicherstellen, dass der Eintrag dem User gehört
        if (!history.getUser().getId().equals(user.getId())) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("{\"message\": \"Not authorized to delete this entry\"}")
                    .build();
        }

        historyRepo.delete(history);
        return Response.noContent().build();
    }
}