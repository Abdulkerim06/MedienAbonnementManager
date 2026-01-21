package at.htlleonding.tran.boundary;


import at.htlleonding.tran.dto.ProviderApi;
import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.ressource.TmdbService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Path("/api/provider")
@Produces(MediaType.APPLICATION_JSON)
public class ProviderRessource {
    @Inject
    TmdbService tmdbService;

    @GET
    public Response getAllProvider(){
        try {
            List<ProviderApi> json = tmdbService.getProviders();
            return Response.ok(json).build();
        }catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

}
