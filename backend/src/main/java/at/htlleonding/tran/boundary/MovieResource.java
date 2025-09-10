package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.ProviderUpdateRequest;

import at.htlleonding.tran.model.UserMovieDb;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import at.htlleonding.tran.ressource.TmdbService;
import at.htlleonding.tran.dto.ProviderInfoDTO;
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
    @Path("/users")
    public Response getMovieUsers() {
        Set<UserMovieDb> users = userMovieDBRepository.findAll();

        return Response.status(Response.Status.OK).entity(users).build();
    }

    @POST
    @Path("/users/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser(UserMovieDb userMovieDb){
        try {
            this.userMovieDBRepository.save(userMovieDb);
        }catch (Exception ex) {
            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity(String.format("{\"message\": \"%s\"}",ex.getMessage()))
                            .build()
            );
        }

        return Response.status(Response.Status.CREATED).entity(userMovieDb).build();
    }

    @PUT
    @Path("/users/{id}/providers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserProviders(
            @PathParam("id") Long userId,
            ProviderUpdateRequest request
    ){
        try {
            System.out.println("Received request for user ID: " + userId);
            System.out.println("toAdd: " + request.getToAdd());
            System.out.println("toRemove: " + request.getToRemove());

            userMovieDBRepository.updateProviders(userId, request.getToAdd(), request.getToRemove());
            return Response.ok().build();
        } catch (EntityNotFoundException e) {
            System.out.println("User not found: " + userId);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}