package at.htlleonding.tran.dto;

import java.util.UUID;

public record ProviderInfoDTO (
        Long tmdbProviderId,
    String name,
    String logoUrl,
    boolean ownedByUser){
}
