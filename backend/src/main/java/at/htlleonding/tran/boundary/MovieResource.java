package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.ProviderUpdateRequest;

import at.htlleonding.tran.dto.TrendingMovieDTO;
import at.htlleonding.tran.model.UserMovieDb;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import at.htlleonding.tran.ressource.TmdbService;
import at.htlleonding.tran.dto.ProviderInfoDTO;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


import java.util.List;
import java.util.Set;

@Path("/api/movies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MovieResource {

    @Inject
    TmdbService tmdbService;
    @Inject
    UserMovieDBRepository userMovieDBRepository;

    @PermitAll
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

    @PermitAll
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


    @GET
    @Path("/{id}/providers/filtered")
    public Response getFilteredProviders(
            @PathParam("id") Long movieId,
            @QueryParam("country") @DefaultValue("DE") String countryCode) {
        try {
            List<ProviderInfoDTO> providers = tmdbService.getFilteredProviders(movieId, countryCode);
            return Response.ok(providers).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }


    @GET
    @Path("/{id}/{userid}/providers/filtered/ByUserProvider")
    public Response getFilteredProvidersByUserProvider(
            @PathParam("id") int movieId,
            @PathParam("userid") Long userId,
            @QueryParam("country") @DefaultValue("DE") String countryCode) {
        try {
            List<ProviderInfoDTO> providers = tmdbService.getFilteredProvidersAndCheckedForProvidersOfUser(movieId, countryCode,userId);
            return Response.ok(providers).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/trending/{timeWindow}")
    public Response getTrendingMovie(
            @PathParam("timeWindow") String timeWindow
    ){
        try {
            List<TrendingMovieDTO> jsonResponse = tmdbService.getTrendingMovies(timeWindow);
            return Response.ok(jsonResponse).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }


}