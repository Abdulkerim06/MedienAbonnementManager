package at.htlleonding.tran.dto;

import at.htlleonding.tran.model.BillingCycle;

import java.time.LocalDate;

public record ProviderWithOwnership(
        Long id,
        Long tmdbProviderId,
        String providerName,
        String logoPath,
        Boolean ownedByUser,
        BillingCycle billingCycle,
        LocalDate lastBillingDate
) {}
