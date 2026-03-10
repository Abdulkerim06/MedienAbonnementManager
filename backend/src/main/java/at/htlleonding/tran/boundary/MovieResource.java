package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.TrendingMovieDTO;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import at.htlleonding.tran.ressource.TmdbService;
import at.htlleonding.tran.dto.ProviderInfoDTO;
import at.htlleonding.tran.service.UserService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;


import java.util.List;
import java.util.UUID;

@Path("/api/movies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MovieResource {

    @Inject
    TmdbService tmdbService;
    @Inject
    UserMovieDBRepository userMovieDBRepository;
    @Inject
    JsonWebToken jwt;
    @Inject
    UserService userService;

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
    public Response getMovieByName(
            @PathParam("name") String movieName,
            @QueryParam("page") @DefaultValue("1") int page
    ) {
        try {
            String json = tmdbService.getMovieByName(movieName, page);
            return Response.ok(json).build();
        } catch (Exception e) {
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


//    @GET
//    @Path("/{id}/{userid}/providers/filtered/ByUserProvider")
//    public Response getFilteredProvidersByUserProvider(
//            @PathParam("id") int movieId,
//            @PathParam("userid") Long userId,
//            @QueryParam("country") @DefaultValue("DE") String countryCode) {
//        try {
//            List<ProviderInfoDTO> providers = tmdbService.getFilteredProvidersAndCheckedForProvidersOfUser(movieId, countryCode,userId);
//            return Response.ok(providers).build();
//        } catch (Exception e) {
//            return Response.status(Response.Status.BAD_GATEWAY)
//                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
//                    .build();
//        }
//    }

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

    // Endpoint für angemeldete User
    @GET
    @Path("/{id}/providers/for-user")
    @RolesAllowed("user")
    public Response getProvidersForCurrentUser(
            @PathParam("id") Long movieId,
            @QueryParam("country") @DefaultValue("DE") String countryCode
    ) {
        try {
            // Hole User-ID aus JWT
            UUID userId = UUID.fromString(jwt.getSubject());

            List<ProviderInfoDTO> providers =
                    tmdbService.getFilteredProvidersForUser(movieId, countryCode, userId);

            return Response.ok(providers).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    // Alternativ: Mit expliziter User-ID (für Admin-Zwecke)
    @GET
    @Path("/{id}/providers/user/{userId}")
    @RolesAllowed({"user", "admin"})
    public Response getProvidersForSpecificUser(
            @PathParam("id") Long movieId,
            @PathParam("userId") UUID userId,
            @QueryParam("country") @DefaultValue("DE") String countryCode
    ) {
        try {
            List<ProviderInfoDTO> providers =
                    tmdbService.getFilteredProvidersForUser(movieId, countryCode, userId);

            return Response.ok(providers).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_GATEWAY)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }


}