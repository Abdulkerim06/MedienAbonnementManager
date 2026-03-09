package at.htlleonding.tran.service;

import at.htlleonding.tran.model.UserMovieDB;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    UserMovieDBRepository userRepo;

    @Inject
    JsonWebToken jwt;

    /**
     * Holt oder erstellt den User basierend auf der Keycloak User-ID aus dem JWT-Token.
     * Diese Methode sollte bei jedem authentifizierten Request aufgerufen werden.
     */
    @Transactional
    public UserMovieDB getCurrentUser() {
        UUID keycloakUserId = UUID.fromString(jwt.getSubject());
        
        return userRepo.findByUUID(keycloakUserId)
                .orElseGet(() -> {
                    UserMovieDB newUser = new UserMovieDB(keycloakUserId);
                    userRepo.persist(newUser);
                    return newUser;
                });
    }

    /**
     * Gibt die Keycloak User-ID des aktuell authentifizierten Users zurück.
     */
    public UUID getCurrentUserId() {
        return UUID.fromString(jwt.getSubject());
    }
}
