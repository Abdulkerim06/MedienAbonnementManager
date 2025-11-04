package at.htlleonding.tran.boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;


import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.Authenticated;

@Path("/api/users")
public class SecureRessource {

    @Inject
    SecurityIdentity identity;

    @GET
    @Path("/me")
    public User me() {
        return new User(identity);
    }

    public static class User {

        private final String userName;

        User(SecurityIdentity identity) {
            this.userName = identity.getPrincipal().getName();
        }

        public String getUserName() {
            return userName;
        }
    }
}