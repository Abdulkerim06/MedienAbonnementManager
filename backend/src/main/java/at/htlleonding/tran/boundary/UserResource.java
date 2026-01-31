package at.htlleonding.tran.boundary;

import at.htlleonding.tran.dto.SubscriptionUpdateDTO;
import at.htlleonding.tran.model.UserMovieDB;
import at.htlleonding.tran.repository.UserMovieDBRepository;
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
    JsonWebToken jwt; // Quarkus füllt dies automatisch aus dem Bearer Token

    @GET
    @RolesAllowed("user") // Nur Zugriff, wenn der Token die Rolle 'user' hat
    @Produces(MediaType.TEXT_PLAIN)
    @Path("test")
    public String hello() {
        // Du kannst Infos aus dem Token auslesen (z.B. User ID oder Name)
        return "Hallo " + jwt.getName() + ", dein Token ist gültig!";
    }

    @PermitAll
    @GET
    public Response getMovieUsers() {
        return Response.ok(userRepo.findAll()).build();
    }

    @PermitAll
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser(UUID uuid) {
        UserMovieDB user = userRepo.findById(uuid.toString());
        try {
            if (user == null){
                user = new UserMovieDB(uuid);
                this.userRepo.save(user);
            }
        }catch (Exception ex) {
            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity(String.format("{\"message\": \"%s\"}",ex.getMessage()))
                            .build()
            );
        }
        return Response.status(Response.Status.CREATED).entity(user).build();
    }



    @PUT
    @Path("/providers")
    public Response updateProvider(
            @QueryParam("UUID") UUID userId,
            @QueryParam("provider") List<SubscriptionUpdateDTO> updates
    ){
        UserMovieDB user = userRepo.findById(userId.toString());
        try {
            userRepo.updateSubscriptions(userId,updates);
        }catch (Exception ex) {
            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity(String.format("{\"message\": \"%s\"}",ex.getMessage()))
                            .build()
            );
        }
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

//    @POST
//    public  Response createuser(){
//        return null;
//    }



//    @PUT
//    @Path("/{id}/providers")
//    public Response updateUserProviders(
//            @PathParam("id") Long userId,
//            ProviderUpdateRequest request
//    ){
//        try {
//
//            userRepo.updateProviders(userId, request.getToAdd(), request.getToRemove());
//            return Response.ok().build();
//        } catch (EntityNotFoundException e) {
//            System.out.println("User not found: " + userId);
//            return Response.status(Response.Status.NOT_FOUND)
//                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
//                    .build();
//        } catch (Exception e) {
//            System.out.println("Error: " + e.getMessage());
//            return Response.status(Response.Status.BAD_REQUEST)
//                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
//                    .build();
//        }
//    }
}
