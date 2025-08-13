package at.htlleonding.tran.boundary;

import at.htlleonding.tran.rest.TmdbApiClient;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.annotation.security.RolesAllowed;

@Path("/api/movies")
@Consumes(MediaType.APPLICATION_JSON)
public class MovieResource {

    @ConfigProperty(name = "tmdb.api.token")
    String apiToken;

    @GET
    @Path("/{id}/providers")
    @RolesAllowed({"user", "admin"})
    public Response getWatchProviders(@PathParam("id") String movieId) {
        TmdbApiClient client = new TmdbApiClient();  // manuell erstellen
        String bearer = "Bearer " + apiToken;
        try {
            String result = client.getWatchProviders(bearer, movieId);
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Fehler beim Abrufen von Watch-Providern")
                    .build();
        }
    }
}
