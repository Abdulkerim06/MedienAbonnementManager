package at.htlleonding.tran.boundary;

import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.repository.ProviderRepository;
import at.htlleonding.tran.ressource.ProviderSyncService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/providers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProviderRessource {

    @Inject
    ProviderRepository providerRepo;

    @Inject
    ProviderSyncService providerSyncService;

    @GET
    public Response getAllProvidersFromDb() {
        List<Provider> providers = providerRepo.findAll();
        return Response.ok(providers).build();
    }

    @POST
    @Path("/sync")
    public Response syncProvidersFromTmdb() {
        providerSyncService.syncProviders();
        return Response.noContent().build();
    }
}