package at.htlleonding.tran.dto;

import at.htlleonding.tran.model.BillingCycle;

import java.time.LocalDate;

public record SubscriptionUpdateDTO(
        Long providerId,
        BillingCycle billingCycle,
        LocalDate lastBillingDate
) {}
