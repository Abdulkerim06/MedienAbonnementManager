package at.htlleonding.tran.boundary;

import at.htlleonding.tran.ressource.TmdbService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/movies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MovieResource {

    @Inject
    TmdbService tmdbService;



    @GET
    @Path("/id/{id}")
    public Response getMovieById(@PathParam("id") int movieId){
        try {
            String json = tmdbService.getMovieByID(movieId);
            return Response.ok(json).build();
        }catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }


    @GET
    @Path("/name/{name}")
    public Response getMovieById(@PathParam("name") String movieName){
        try {
            String json = tmdbService.getMovieByName(movieName);
            return Response.ok(json).build();
        }catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/{id}/providers")
    public Response getMovieProvidersOfId(@PathParam("id") int movieId) {
        try {
            String json = tmdbService.getMovieProviders(movieId);
            return Response.ok(json).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}