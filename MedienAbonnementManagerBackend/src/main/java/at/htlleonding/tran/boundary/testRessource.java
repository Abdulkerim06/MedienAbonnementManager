package at.htlleonding.tran.boundary;

import java.util.List;

import at.htlleonding.tran.repository.testRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
public class testRessource {
    @Inject
    testRepository repo;
}
