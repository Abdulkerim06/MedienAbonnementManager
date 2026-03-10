import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/auth-service';
import { BillingCycle, Provider } from '../../interfaces/provider';
import { ProviderService } from '../../services/provider-service';

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
  showOnlyOwned = true;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  readonly billingCycles: BillingCycle[] = ['MONTHLY', 'YEARLY'];

  constructor(
    private readonly providerService: ProviderService,
    protected readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.isLoading = false;
      this.errorMessage = 'Bitte melde dich als User an, um deine Abos zu verwalten.';
      this.cdr.markForCheck();
      return;
    }

    this.loadProviders();
  }

  protected get visibleProviders(): Provider[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.providers.filter((provider) => {
      const matchesQuery = !query || provider.providerName.toLowerCase().includes(query);
      const matchesOwnership = !this.showOnlyOwned || provider.ownedByUser;
      return matchesQuery && matchesOwnership;
    });
  }

  protected toggleOwned(provider: Provider, owned: boolean): void {
    provider.ownedByUser = owned;

    if (owned) {
      provider.billingCycle ??= 'MONTHLY';
      provider.lastBillingDate ??= this.today();
    }

    this.successMessage = '';
    this.cdr.markForCheck();
  }

  protected saveSubscriptions(): void {
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
          this.successMessage = 'Deine Abos wurden gespeichert.';
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Die Abos konnten nicht gespeichert werden.';
          this.cdr.markForCheck();
        }
      });
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

  protected get ownedProvidersCount(): number {
    return this.providers.filter((provider) => provider.ownedByUser).length;
  }

  private loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.providerService.getProviders()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (providers) => {
          this.providers = providers.map((provider) => ({
            ...provider,
            billingCycle: provider.billingCycle ?? (provider.ownedByUser ? 'MONTHLY' : null),
            lastBillingDate: provider.lastBillingDate ?? (provider.ownedByUser ? this.today() : null)
          }));
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

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
