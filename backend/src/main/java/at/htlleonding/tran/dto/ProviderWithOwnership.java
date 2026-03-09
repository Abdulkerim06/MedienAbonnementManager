package at.htlleonding.tran.dto;


public record ProviderWithOwnership(
        Long id,
        Long tmdbProviderId,
        String providerName,
        String logoPath,
        Boolean ownedByUser
) {}