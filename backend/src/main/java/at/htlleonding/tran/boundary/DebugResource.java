package at.htlleonding.tran.boundary;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/debug")
public class DebugResource {

    @Inject
    JsonWebToken jwt; // Quarkus füllt dies automatisch aus dem Bearer Token

    @GET
    @Path("/me")
    @Produces(MediaType.APPLICATION_JSON)
    // @RolesAllowed("user") // Optional: Später einkommentieren, um Rollen zu prüfen
    public Response checkToken() {
        if (jwt.getRawToken() == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Kein Token gefunden!").build();
        }

        // Gibt dir den Usernamen und die Ablaufzeit zurück
        return Response.ok(String.format("Token ist da! User: %s, Expires: %d",
                jwt.getName(),
                jwt.getExpirationTime())).build();
    }
}