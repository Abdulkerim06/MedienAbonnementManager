export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface Provider {
  id: number;
  tmdbProviderId: number;
  providerName: string;
  logoPath: string;
  ownedByUser: boolean;
  billingCycle: BillingCycle | null;
  lastBillingDate: string | null;
  price?: number | null;
}
