import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../auth/auth-service';
import { BillingCycle, Provider } from '../../interfaces/provider';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { ProviderService } from '../../services/provider-service';

type ProviderDraft = {
  tmdbProviderId: number | null;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  price: number | null;
};

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './providers.html',
  styleUrl: './providers.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvidersComponent implements OnInit {
  providers: Provider[] = [];
  searchTerm = '';
  addSearchTerm = '';
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  readonly billingCycles: BillingCycle[] = ['MONTHLY', 'YEARLY'];
  readonly draft: ProviderDraft = {
    tmdbProviderId: null,
    billingCycle: 'MONTHLY',
    nextBillingDate: this.today(),
    price: null
  };

  constructor(
    private readonly providerService: ProviderService,
    protected readonly authService: AuthService,
    private readonly keycloak: KeycloakOperationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.refreshAuthState();

    if (!this.authService.isLoggedIn()) {
      this.isLoading = false;
      this.errorMessage = 'Bitte melde dich als User an, um deine Abos zu verwalten.';
      this.cdr.markForCheck();
      return;
    }

    this.loadProviders();
  }

  protected get availableProviders(): Provider[] {
    const query = this.addSearchTerm.trim().toLowerCase();

    return this.providers
      .filter((provider) => !provider.ownedByUser)
      .filter((provider) => !query || provider.providerName.toLowerCase().includes(query));
  }

  protected get activeSubscriptions(): Provider[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.providers
      .filter((provider) => provider.ownedByUser)
      .filter((provider) => !query || provider.providerName.toLowerCase().includes(query))
      .sort((left, right) => left.providerName.localeCompare(right.providerName));
  }

  protected get activeSubscriptionsCount(): number {
    return this.providers.filter((provider) => provider.ownedByUser).length;
  }

  protected get subscriptionsWithPriceCount(): number {
    return this.providers.filter((provider) => provider.ownedByUser && provider.price != null).length;
  }

  protected addSubscription(): void {
    if (!this.draft.tmdbProviderId) {
      this.errorMessage = 'Bitte waehle einen Provider aus.';
      this.successMessage = '';
      this.cdr.markForCheck();
      return;
    }

    if (!this.draft.nextBillingDate) {
      this.errorMessage = 'Bitte gib an, wann das Abo ablaeuft oder erneut verrechnet wird.';
      this.successMessage = '';
      this.cdr.markForCheck();
      return;
    }

    const provider = this.providers.find((entry) => entry.tmdbProviderId === this.draft.tmdbProviderId);
    if (!provider) {
      this.errorMessage = 'Der ausgewaehlte Provider wurde nicht gefunden.';
      this.successMessage = '';
      this.cdr.markForCheck();
      return;
    }

    provider.ownedByUser = true;
    provider.billingCycle = this.draft.billingCycle;
    provider.lastBillingDate = this.toLastBillingDate(this.draft.nextBillingDate, this.draft.billingCycle);
    provider.price = this.normalizePrice(this.draft.price);

    this.draft.tmdbProviderId = null;
    this.draft.billingCycle = 'MONTHLY';
    this.draft.nextBillingDate = this.today();
    this.draft.price = null;
    this.addSearchTerm = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.persistSubscriptions('Abo wurde gespeichert.');
  }

  protected removeSubscription(provider: Provider): void {
    provider.ownedByUser = false;
    provider.billingCycle = null;
    provider.lastBillingDate = null;
    provider.price = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.persistSubscriptions('Abo wurde entfernt.');
  }

  protected saveSubscriptions(): void {
    this.persistSubscriptions('Abo wurde gespeichert.');
  }

  protected persistSubscriptions(successMessage: string = 'Deine Abos wurden gespeichert.'): void {
    const invalidProvider = this.providers.find((provider) =>
      provider.ownedByUser && (!provider.billingCycle || !provider.lastBillingDate)
    );

    if (invalidProvider) {
      this.errorMessage = `Bitte vervollstaendige ${invalidProvider.providerName}.`;
      this.successMessage = '';
      this.cdr.markForCheck();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    this.providerService.updateSubscriptions(this.providers)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.persistPrices();
          this.successMessage = successMessage;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Die Abos konnten nicht gespeichert werden.';
          this.cdr.markForCheck();
        }
      });
  }

  protected updateNextBillingDate(provider: Provider, nextBillingDate: string): void {
    provider.lastBillingDate = nextBillingDate
      ? this.toLastBillingDate(nextBillingDate, provider.billingCycle ?? 'MONTHLY')
      : null;
    this.successMessage = '';
    this.persistSubscriptions('Abo wurde aktualisiert.');
  }

  protected updateBillingCycle(provider: Provider, cycle: BillingCycle): void {
    const currentNextBillingDate = this.nextBillingDate(provider);
    provider.billingCycle = cycle;
    provider.lastBillingDate = this.toLastBillingDate(currentNextBillingDate, cycle);
    this.successMessage = '';
    this.persistSubscriptions('Abo wurde aktualisiert.');
  }

  protected updatePrice(provider: Provider, price: string | number | null): void {
    provider.price = this.normalizePrice(price);
    this.successMessage = '';
    this.cdr.markForCheck();
  }

  protected providerLogo(provider: Provider): string | null {
    if (!provider.logoPath) {
      return null;
    }

    if (provider.logoPath.startsWith('http://') || provider.logoPath.startsWith('https://')) {
      return provider.logoPath;
    }

    if (provider.logoPath.startsWith('/')) {
      return `https://image.tmdb.org/t/p/w92${provider.logoPath}`;
    }

    return provider.logoPath;
  }

  protected billingCycleLabel(cycle: BillingCycle): string {
    return cycle === 'MONTHLY' ? 'Monatlich' : 'Jaehrlich';
  }

  protected nextBillingDate(provider: Provider): string {
    if (!provider.lastBillingDate) {
      return this.today();
    }

    const date = new Date(`${provider.lastBillingDate}T00:00:00`);
    if (provider.billingCycle === 'YEARLY') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    return this.formatDate(date);
  }

  protected formatPrice(price: number | null | undefined): string {
    if (price == null || Number.isNaN(price)) {
      return '-';
    }

    return `${price.toFixed(2)} EUR`;
  }

  private loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    forkJoin({
      allProviders: this.providerService.getAllProviders(),
      userProviders: this.providerService.getUserProviders()
    })
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: ({ allProviders, userProviders }) => {
          this.providers = this.mergeProviders(allProviders, userProviders);
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.errorMessage = error.status === 403
            ? 'Du brauchst die Rolle user und ein gueltiges Login, um diese Seite zu nutzen.'
            : 'Provider konnten nicht geladen werden.';
          this.cdr.markForCheck();
        }
      });
  }

  private mergeProviders(allProviders: Provider[], userProviders: Provider[]): Provider[] {
    const userProvidersByTmdbId = new Map(
      userProviders.map((provider) => [provider.tmdbProviderId, provider] as const)
    );
    const storedPrices = this.readStoredPrices();

    return allProviders.map((provider) => {
      const savedProvider = userProvidersByTmdbId.get(provider.tmdbProviderId);
      return {
        ...provider,
        ownedByUser: savedProvider?.ownedByUser ?? false,
        billingCycle: savedProvider?.billingCycle ?? null,
        lastBillingDate: savedProvider?.lastBillingDate ?? null,
        price: storedPrices[provider.tmdbProviderId] ?? null
      };
    });
  }

  private persistPrices(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const payload = this.providers.reduce<Record<number, number>>((result, provider) => {
      if (provider.ownedByUser && provider.price != null) {
        result[provider.tmdbProviderId] = provider.price;
      }
      return result;
    }, {});

    localStorage.setItem(this.getPricesStorageKey(), JSON.stringify(payload));
  }

  private readStoredPrices(): Record<number, number> {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    try {
      const rawValue = localStorage.getItem(this.getPricesStorageKey());
      return rawValue ? JSON.parse(rawValue) as Record<number, number> : {};
    } catch {
      return {};
    }
  }

  private getPricesStorageKey(): string {
    const subject = this.keycloak.getSubject();
    return subject ? `provider-prices:${subject}` : 'provider-prices:anonymous';
  }

  private toLastBillingDate(nextBillingDate: string, cycle: BillingCycle): string {
    const date = new Date(`${nextBillingDate}T00:00:00`);
    if (cycle === 'YEARLY') {
      date.setFullYear(date.getFullYear() - 1);
    } else {
      date.setMonth(date.getMonth() - 1);
    }

    return this.formatDate(date);
  }

  private normalizePrice(price: string | number | null): number | null {
    if (price == null || price === '') {
      return null;
    }

    const parsed = typeof price === 'number' ? price : Number(price);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private formatDate(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
