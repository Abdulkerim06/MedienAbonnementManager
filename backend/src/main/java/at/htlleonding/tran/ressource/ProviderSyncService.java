package at.htlleonding.tran.ressource;

import at.htlleonding.tran.dto.ProviderApi;
import at.htlleonding.tran.repository.ProviderRepository;
import at.htlleonding.tran.model.Provider;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.*;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import java.util.stream.Collectors;

@ApplicationScoped
public class ProviderSyncService {

    @Inject
    TmdbService tmdbService;

    @Inject
    ProviderRepository providerRepo;

    @Transactional
    public void syncProviders() {
        List<ProviderApi> apiProviders = tmdbService.getProviders();

        for (ProviderApi api : apiProviders) {
            providerRepo.upsertFromTmdb(
                    api.id(),
                    api.provider_name(),
                    api.logo_path()
            );
        }
    }
}
