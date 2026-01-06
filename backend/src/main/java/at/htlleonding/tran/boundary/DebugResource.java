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

    @GET
    @Path("/me")
    @Produces(MediaType.APPLICATION_JSON)
    // @RolesAllowed("user") // Optional: Später einkommentieren, um Rollen zu prüfen
    public String checkToken() {
        return "test successfull";
    }
}